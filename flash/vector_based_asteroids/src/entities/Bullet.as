package entities 
{
	import flash.display.BitmapData;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	/**
	 * ...
	 * @author Daniel Lee
	 */
	public class Bullet extends GameSprite 
	{
		
		private var speed:Point;
		private var max_speed:Number;
		public var life:Number;
		public function Bullet(x:int, y:int, life:Number, angle:Number = 0)
		{
			super(x, y, 2, 2, angle);
			max_speed = 10;
			image = new BitmapData(width, height, false, 0xFFFFFF);
			this.speed = new Point(max_speed*Math.sin(angle), -max_speed*Math.cos(angle));
			this.life = life;
			this.angle = angle;
		}
		override public function Render():void
		{
			Game.Renderer.copyPixels(image, new Rectangle(0, 0, width, height), new Point(x, y));
			super.Render();
		}
		override public function Update():void
		{
 
			x += speed.x;
			y += speed.y;	
 
			if (x + width <= 0)
				x = Game.Renderer.width - width;
			else if(x >= Game.Renderer.width)
				x = 0;
 
			if (y + height <= 0)
				y = Game.Renderer.height - height;
			else if(y >= Game.Renderer.height)
				y = 0;
 
			super.Update();
		}
		
	}

}