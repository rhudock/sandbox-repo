package com.inq.flash.agent.data
{
	public class CallDuration
	{
		import flash.utils.Timer;
		import flash.events.TimerEvent;
		import flash.utils.getTimer;
		
		private var MIN_MASK:String = "00";
		private var SEC_MASK:String = "00";
		private var HR_MASK:String = "00";
		private var TIMER_INTERVAL:int = 1000;
		
		private var baseTimer:int;
        private var chatPanel:ChatPanel;
		
		private var t:Timer;

        public function CallDuration(chatPanel:ChatPanel):void {
            this.chatPanel = chatPanel;
        }
		
        private function updateTimer(evt:TimerEvent):void {
            var d:Date = new Date(getTimer() - baseTimer);
            if(d.hours > 0 && d.minutes < 59 )
               d.hours = 0;
            if(d.minutes >= 59)
                d.hours++;   
            var min:String = (MIN_MASK + d.minutes).substr(-MIN_MASK.length);
            var sec:String = (SEC_MASK + d.seconds).substr(-SEC_MASK.length);
            var hr:String  = (HR_MASK + d.hours).substr(-HR_MASK.length);
            //counter.text = String(min + ":" + sec + "." + ms);
            chatPanel.setCallDuration(String(hr + ":" + min + ":" + sec));
         }
        
	     public function startTimer():void {
                baseTimer = getTimer();
                t.start();
         }
         public function stopTimer():void {
                t.stop();
         }
         public function registerTimer():void {
                if(t == null) {
                	t = new Timer(TIMER_INTERVAL);
            		t.addEventListener(TimerEvent.TIMER, updateTimer);
                }
         }  	
         public function killTimer():void {
         	  if(t != null)
         	   t = null;
         	        
         }

	}
}