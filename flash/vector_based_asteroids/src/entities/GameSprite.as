package entities 
{
	import flash.display.BitmapData;
	import flash.display.Sprite;
	import flash.geom.Point;
	import flash.geom.Rectangle;
 
	public class GameSprite
	{
 
		public var x:Number;
		public var y:Number;
		public var width:int;
		public var height:int;
		public var angle:Number;
		public var rotate_offset:Point;
		public var visible:Boolean;
 
		protected var image:BitmapData;
		protected var image_sprite:Sprite;
 
		public var collis_points:Array;
 
		public function GameSprite(x:int, y:int, width:int, height:int, angle:int=0)
		{
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.angle = angle;
			visible = true;
			collis_points = new Array(
			new Point(0, 0),
			new Point(width, 0),
			new Point(width, height),
			new Point(0, height)
			);
			rotate_offset = new Point(0, 0);
		}
		public function Render():void
		{
		}
		public function Update():void
		{
			if (angle == 0)
			{
				collis_points = [
					new Point(x, y),
					new Point(x+width, y),
					new Point(x+width, y+height),
					new Point(x, y+height)
				];
			}
 
		}
		public function CheckIfInNonRotatedRect(obj2:GameSprite):Boolean
		{
			//we'll make sure that this object is a rentangle with no angle
			var intersecting:Boolean = false;
			if (obj2.angle == 0)
			{
				//first we check the top left point
				if (x >= obj2.x && x <= obj2.x + obj2.width)
					if (y >= obj2.y && y <= obj2.y + obj2.height)
						return true;
 
				//now we'll check the top right point
				if (x+width >= obj2.x && x+width <= obj2.x + obj2.width)
					if (y >= obj2.y && y <= obj2.y + obj2.height)
						return true;
 
				//now we check the bottom right point
				if (x+width >= obj2.x && x+width <= obj2.x + obj2.width)
					if (y+height >= obj2.y && y+height <= obj2.y + obj2.height)
						return true;
 
				//And check the bottom left point
				if (x >= obj2.x && x <= obj2.x + obj2.width)
					if (y+height >= obj2.y && y+height <= obj2.y + obj2.height)
						return true;
			}
 
			return intersecting;
		}
	}
}