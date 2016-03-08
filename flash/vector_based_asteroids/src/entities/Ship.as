package entities
{
	import entities.GameSprite;
	import flash.display.Sprite;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.geom.Rectangle;
 
	public class Ship extends GameSprite
	{
		private var rotate_amount:int;
 
		public var speed:Point;
		private var speed_multi:Number = .5;
		private var friction:Number = .95;
 
		public function Ship(x:int, y:int, width:int, height:int)
		{
			super(x, y, width, height);
			image_sprite = new Sprite();
			image_sprite.graphics.lineStyle(2, 0xFFFFFF);
			rotate_amount = 15;
			speed =  new Point(0, 0);
			rotate_offset = new Point(width / 2, height / 2);
 
			//create the ship drawing
			image_sprite.graphics.moveTo(0, height);
			image_sprite.graphics.lineTo(width / 2, 0);
			image_sprite.graphics.lineTo(width, height);
 
			//draw the line across
			image_sprite.graphics.moveTo((7*height/8 -height)/(-height/(width/2)), 7*height/8 );
			image_sprite.graphics.lineTo((7*height/8 -height)/(height/(width/2))+width, 7*height/8);
		}
		override public function Render():void
		{
			if (!visible)
				return;
 
			var matrix:Matrix = new Matrix();
			matrix.translate(-rotate_offset.x, -rotate_offset.y);
			matrix.rotate(angle);
			matrix.translate(rotate_offset.x, rotate_offset.y);
			matrix.translate(x, y);
 
			Game.Renderer.draw(image_sprite, matrix);
		}
 
		override public function Update():void
		{
			x += speed.x;
			y += speed.y;
			speed.x *= friction;
			speed.y *= friction;
			var angle_deg:int = angle * (180.0 / Math.PI);
 
			if (x + width <= 0)
				x = Game.Renderer.width - width;
			else if(x >= Game.Renderer.width)
				x = 0;
 
			if (y + height <= 0)
				y = Game.Renderer.height - height;
			else if(y >= Game.Renderer.height)
				y = 0;
 
			//now find the collision points
			var x_top:int = 0 * Math.cos(angle) + rotate_offset.y * Math.sin(angle)+x+rotate_offset.x;
			var y_top:int = 0 * Math.sin(angle) - rotate_offset.y * Math.cos(angle) + y + rotate_offset.y;
 
			var x_b_left:int = (-rotate_offset.x) * Math.cos(angle) - (height-rotate_offset.y) * Math.sin(angle)+x+rotate_offset.x;
			var y_b_left:int = (-rotate_offset.x) * Math.sin(angle) + (height-rotate_offset.y)  * Math.cos(angle) + y + rotate_offset.y;
 
			var x_b_right:int = (rotate_offset.x) * Math.cos(angle) - (height-rotate_offset.y) * Math.sin(angle)+x+rotate_offset.x;
			var y_b_right:int = (rotate_offset.x) * Math.sin(angle) + (height - rotate_offset.y) * Math.cos(angle) + y + rotate_offset.y;
 
			collis_points = [new Point(x_top, y_top), new Point(x_b_left, y_b_left), new Point(x_b_right, y_b_right)];
		}
		override public function CheckIfInNonRotatedRect(obj2:GameSprite):Boolean
		{
			var intersecting:Boolean = false;
			if (!visible)
				return false;
 
			if (obj2.angle == 0)
			{
				for (var i:int = 0; i < collis_points.length; i++)
					if (collis_points[i].x >= obj2.x && collis_points[i].x <= obj2.x + obj2.width)
						if (collis_points[i].y >= obj2.y && collis_points[i].y <= obj2.y + obj2.height)
							return true;
			}
			return intersecting;
 
		}
		public function RotateLeft():void
		{
			//first convert angle in rads
			var angle_deg:int = Math.round(angle * (180.0 / Math.PI));
			angle_deg -= rotate_amount;
			angle = angle_deg * (Math.PI / 180.0);
		}
		public function RotateRight():void
		{
			var angle_deg:int = angle * (180.0 / Math.PI);
			angle_deg += rotate_amount;
			angle = angle_deg * (Math.PI / 180.0);
		}
		public function Thrust(dir:int=1):void
		{
			var angle_deg:int = angle * (180.0 / Math.PI);
			if (dir == 1)
			{
				speed.x +=speed_multi * Math.sin(angle);
				speed.y -= speed_multi * Math.cos(angle);
			}
			else
			{
				speed.x -=speed_multi * Math.sin(angle);
				speed.y += speed_multi * Math.cos(angle);
			}
		}
	}
}