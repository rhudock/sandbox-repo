

To Compile
`mvn -am clean install -Denv=dev -pl :agent -T2 -DskipTests`

`
C:\code\tc\rt\flex\agent\target\agent
C:\bin\flex_sdk_4.6\bin\adl.exe AgentApplication-app.xml -- user=agt@tc.com pw=123 login=true
`
apiConfigurationConnection.requestApi(PERFORMANCE_CONFIGURATION_PATH, apiParams);
private function requestConfiguration(event:Event = null):void {
PerformanceDashboard.mxml - private function updatePerformanceConfiguration(data:String = null):void {


-- APIConnection.as -
protected function requestApiComplete(event:Event):void {

public function requestApi(url:String, apiParams:URLVariables):void {
	urlLoader.addEventListener(Event.COMPLETE, requestApiComplete);
	urlLoader.addEventListener(IOErrorEvent.IO_ERROR, requestApiError);
	urlLoader.addEventListener(IOErrorEvent.NETWORK_ERROR, requestApiError);
	urlLoader.addEventListener(HTTPStatusEvent.HTTP_STATUS, requestApiStatus);

'<?xml version="1.0" ?><performanceConfiguration xmlns="http://www.touchcommerce.com/2015/performance_metrics" name="active"><metrics settingId="10004039"><type name="volume"><metric>assignedCount</metric><metric>percentAssisted</metric><metric>conversionCount</metric><metric>conversionProductQuantity</metric><metric>avgConversionProductQuantity</metric><metric>assignedCount</metric><metric>conversionCount</metric></type><type name="efficiency"><metric>avgEngagementHandleTime</metric><metric>avgEngagementHandleTimeSLA</metric><metric>avgEngagementHandleTime</metric></type><type name="loggedInTime"><metric>loginDuration</metric><metric>totalBusyTime</metric><metric>busyClicksCount</metric><metric>loginDuration</metric><metric>totalBusyTime</metric></type><type name="utilization"><metric>agentUtilization</metric><metric>availableUtilization</metric><metric>agentUtilization</metric></type></metrics></performanceConfiguration>'