package 
{
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	
	/**
	 * ...
	 * @author Daniel Lee
	 * http://chrismweb.com/2011/01/26/creating-an-asteroids-game-part-1-setting-up-flashdevelop-and-planning/
	 */
	public class Main extends Sprite 
	{
		private var game:Game;
		public function Main():void 
		{
			if (stage) init();
			else addEventListener(Event.ADDED_TO_STAGE, init);
		}
		
		private function init(e:Event = null):void 
		{
			removeEventListener(Event.ADDED_TO_STAGE, init);
			// entry point
			
			game = new Game(stage.stageWidth, stage.stageHeight);
			
			addChild(game.bitmap);
			
			addEventListener(Event.ENTER_FRAME, Run);
			
			// add Keylisteners
			stage.addEventListener(KeyboardEvent.KEY_DOWN, game.KeyDown);
			stage.addEventListener(KeyboardEvent.KEY_DOWN, game.KeyUp);
		}
		
		private function Run(e:Event):void
		{
			game.Update();
			game.Render();
		}
		
	}
	
}