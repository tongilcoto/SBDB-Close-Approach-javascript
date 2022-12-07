CUCUMBER_JSON_REPORT_PATH=./reports/cucumber. json
TEST_PLAN_KEY="$1"
REGRESSION_SUITE="$2"
if [ "$TEST_PLAN_KEY" == "" ]; then
echo "TEST_PLAN_KEY missing. Usage: /upload-cucumber-results-to-xray.sh <TEST_PLAN_KEY> <REGRESSION_SUITE. Values: ALL IEARN_API OPERATOR_ API I ACCOUNTING_CYCLE>"
exit 1 
fi
if [ "$REGRESSION_SUITE" == "" ]; then
echo "REGRESSION_SUITE missing. Usage: /upload-cucumber-results-to-xray.sh <TEST_PLAN_KEY> <REGRESSION_SUITE. Values: ALL I EARN_APT I OPERATOR_API I ACCOUNTING_CYCLE>" 
exit 1
fi
if [ "$XRAY_CLIENT_ID" == "" ]; then 
echo "XRAY_CLIENT_ID env var is empty" exit 1
fi
if [ "$XRAY_CLIENT_SECRET" == "" ]; then
echo "XRAY_CLIENT_SECRET env var is empty" 
exit 1 
fi 
echo '{
"client_id": "'$XRAY_CLIENT_ID'",
"client_secret": "'$XRAY_CLIENT _SECRET'" 
}' > /tmp/xray_auth. json
token=$(curl -H "Content-Type: application/json" -X POST --data @"/tmp/xray_auth.json" https://xray.cloud.getxray.app/apt/v2/authenticatel tr -d '"') 
today=`date "+%Y-%m-%d"`
echo '{
"fields": {
"project": {
"id": "10032"
}, "summary":
"'$REGRESSION_SUITE' Test Execution Results '$today' for Hash '$DEPLOYED_HASH'"
"issuetype": {
"id": "10039"
},
"xrayFields": {
"testPlankey":
"'$TEST_PLAN_KEY'"
}
}' > /tmp/issueFields.json
cd "$(dirname $0)" # Use the script dir
 if [ ! -f $CUCUMBER_JSON_REPORT_PATH ]; then echo "No cucumber JSON report found at $CUCUMBER_JSON_REPORT_PATH" 
exit 1
fi
curl -H "Content-Type: multipart/form-data" -X POST -F info-@"/tmp/issueFields. json" -F results=@"$CUCUMBER_JSON_REPORT_PATH" -H
"Authorization: Bearer $token" https://xray.cloud.getxray.app/api/v2/import/execution/cucumber/multipart