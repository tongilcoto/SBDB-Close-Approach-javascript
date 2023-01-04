CUCUMBER_JSON_REPORT_PATH=./reports/cucumber.json
TEST_PLAN_KEY="$1"
IS_FEATURE="$2"

# Input variables validation
if [ "$TEST_PLAN_KEY" == "" ]; then
    echo "TEST_PLAN_KEY missing. Usage: /xray-api-upload-cucumber-report.sh <TEST_PLAN_KEY>"
    exit 1 
fi
if [ "$XRAY_CLIENT_ID" == "" ]; then 
    echo "XRAY_CLIENT_ID env var is empty" exit 1
fi
if [ "$XRAY_CLIENT_SECRET" == "" ]; then
    echo "XRAY_CLIENT_SECRET env var is empty" 
    exit 1 
fi 
if [ ! -f $CUCUMBER_JSON_REPORT_PATH ]; then echo "No cucumber JSON report found at $CUCUMBER_JSON_REPORT_PATH" 
    exit 1
fi

#Precalculations
token=$(curl -H "Content-Type: application/json" -X POST --data "{ \"client_id\": \"$XRAY_CLIENT_ID\",\"client_secret\": \"$XRAY_CLIENT_SECRET\" }" https://xray.cloud.getxray.app/api/v2/authenticate| tr -d '"')
today=`date "+%Y-%m-%d"`
transition=11
executionStatusTransitionComment="Execution moved to PASSED"
if [ "$ARE_TESTS_FAILED" == "Y" ]; then
    transition=21
    executionStatusTransitionComment="Execution moved to FAILED because of failed tests"
fi

#Info file for creating the new ticket
if [ "$IS_FEATURE" == "N" ]; then
    echo '{
    "fields": {
        "project": {
            "id": "10002"
        },
        "summary": "'$TEST_PLAN_KEY' '$today' Test Execution Results",
        "description": "'$TEST_PLAN_KEY' '$today' Test Execution Results from Gitlab Pipeline. \n'$executionStatusTransitionComment'",
        "issuetype": {
            "id": "10008"
        }
    },
    "xrayFields": {
        "testPlanKey": "'$TEST_PLAN_KEY'"
    }
}' > /tmp/issueFields.json
else
    echo '{
    "fields": {
        "project": {
            "id": "10002"
        },
        "parent": {
            "key": "'$TEST_PLAN_KEY'"
        },
        "summary": "'$TEST_PLAN_KEY' '$today' Test Execution Results",
        "description": "'$TEST_PLAN_KEY' '$today' Test Execution Results from Gitlab Pipeline. \n'$executionStatusTransitionComment'",
        "issuetype": {
            "id": "10010"
        }
    }
}' > /tmp/issueFields.json
fi
echo "Ticket $TEST_PLAN_KEY for IS_FEATURE $IS_FEATURE with $executionStatusTransitionComment"
cat /tmp/issueFields.json
curl -H "Content-Type: multipart/form-data" -X POST -F "info=@/tmp/issueFields.json" -F "results=@${CUCUMBER_JSON_REPORT_PATH}" -H "Authorization: Bearer ${token}" https://xray.cloud.getxray.app/api/v2/import/execution/cucumber/multipart > output.text
cat output.text

#Status change using Jira transition endpoint
executionUrlV2=`cat output.text | cut -d '"' -f 12`
transitionUrl=`echo $executionUrlV2/transitions`
echo
echo '{"transition": {"id": '$transition'}}' > transition.json
cat transition.json
curl -X POST "$transitionUrl" --user tongilcoto@gmail.com:$JIRA_API_TOKEN -H 'Accept: application/json' -H 'Content-Type: application/json' --data @transition.json > transition.text
cat transition.text
