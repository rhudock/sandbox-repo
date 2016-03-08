package entities 
{
	/**
	 * ...
	 * @author Daniel Lee
	 */
	import flash.display.Sprite;
	import flash.geom.Matrix;
	import flash.geom.Point;
 
	public class Asteroid extends GameSprite
	{
 
		public static const Directions:Array = [Math.PI / 4, 3 * Math.PI / 4, 5 * Math.PI / 4, 7 * Math.PI / 4];
		public static const Sizes:Array = [40, 20, 10];
		public static const Speeds:Array = [1, 3, 5];
 
		private var type:int;
		private var direction:Number;
		private var speed:Point;
 
		public function Asteroid(x:int, y:int, size:Number, direction:Number, type:int)
		{
			super(x, y, Sizes[size], Sizes[size], 0);
 
			this.type = type;
			this.direction = direction = Directions[direction];
			this.speed = new Point( -Speeds[size] * Math.cos(direction), -Speeds[size] * Math.sin(direction));
			trace("speed asteroid, x, y = "+(-Speeds[size] * Math.cos(direction))+", "+(-Speeds[size] * Math.sin(direction))+", direction = "+direction );
 
			image_sprite = new Sprite();
			image_sprite.graphics.lineStyle(1, 0xFFFFFF);
			this.type = type;
 
			if (type == 0)
			{
				//first lets draw the asteroid
				//they are basically circles with some craggly looking edges
				image_sprite.graphics.moveTo(0, 1 / 3 * height);
				image_sprite.graphics.lineTo(1 / 3 * width, 0);//top line
				image_sprite.graphics.lineTo(2 / 3 * width, 0);//top line
				image_sprite.graphics.lineTo(width, 1 / 3 * height); //right slanted line
				image_sprite.graphics.lineTo(width, 2 / 3 * height); //right  line
				image_sprite.graphics.lineTo(2 / 3 * width,  height); //bottom right slanted line
				image_sprite.graphics.lineTo(width / 2,  height); //bottom line
				image_sprite.graphics.lineTo(width / 2,  2 / 3 * height); //vertical bottom line
				image_sprite.graphics.lineTo(1 / 3 * width, height); //slanted bottom left line
				image_sprite.graphics.lineTo(0, 2 / 3 * height); //slanted bottom left line 2
				image_sprite.graphics.lineTo(1 / 3 * width,  height / 2); //slanted center left line 1
				image_sprite.graphics.lineTo(0, 1 / 3 * height);//back to start
			}
			else if (type == 1)
			{
				image_sprite.graphics.moveTo(0, 1 / 3 * height);
				image_sprite.graphics.lineTo(1 / 3 * width, 0);//to top left line
				image_sprite.graphics.lineTo(width / 2, 1 / 3 * height);//to center top
				image_sprite.graphics.lineTo(2 / 3 * width, 0);//to top right line
				image_sprite.graphics.lineTo(width, 1 / 3 * height);//to right top line
				image_sprite.graphics.lineTo(4 / 5 * width, height / 2);//inward right center line
				image_sprite.graphics.lineTo( width, 2 / 3 * height);//to right bottom line
				image_sprite.graphics.lineTo( 2 / 3 * width,  height);//to bottom right line
				image_sprite.graphics.lineTo( 1 / 3 * width,  height);//to bottom left line
				image_sprite.graphics.lineTo( 0,  2 / 3 * height);//to left bottom line
				image_sprite.graphics.lineTo(0, 1 / 3 * height);//back tot he start
			}
		}
		override public function Render():void
		{
 
			var matrix:Matrix = new Matrix();
			matrix.translate(x, y);
			Game.Renderer.draw(image_sprite, matrix);
 
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