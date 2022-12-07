TEST_PLAN_KEY="$1"
if [ "$TEST_PLAN_KEY" == 
"" ]; then
echo "TEST_PLAN_KEY missing. Usage: ./download-feature-files-from-xray.sh <TEST_PLAN_KEY>"
exit 1
fi
if [ "$XRAY_CLIENT_ID" == ""]; then
echo "XRAY_CLIENT_ID env var is empty"
exit 1
fi
if [ "$XRAY_CLIENT_SECRET" == ""]; then
echo "XRAY_CLIENT_SECRET env var is empty"
exit 1
fi
echo '{
"client_id": "'$XRAY_CLIENT_ID'",
"client_secret": "'$XRAY_CLIENT_SECRET'"
]' > /tmp/xray_auth. json
token=$(curl -H "Content-Type: application/json" -X POST --data @"/tmp/xray_auth. json" https://xray.cloud.getxray.app/api/v2/authenticatel tr -d '"')
cd "$(dirname $0)/features"
rm *
curl -H "Content-Type: application/json" -X GET -H "Authorization: Bearer $token"
"https://xray.cloud.getxray.app/api/v2/export/
cucumber?keys=$TEST_PLAN_KEY" -o featureBundle.zip
unzip -j featureBundle.zip
