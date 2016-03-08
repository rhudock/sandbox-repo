package entities 
{
	import flash.display.Sprite;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	/**
	 * ...
	 * @author Chris Moeller
	 */
	public class Explosion extends GameSprite
	{
		private var radius:Number;
		public var finished:Boolean;
		private var size:int;
 
		private var random_offsets:Array;
		private var random_sizes:Array;
 
		private const num_points:int = 12;
		public var life:Number;
		public var max_life:Number;
 
		public function Explosion(x:int, y:int, max_life:Number, size:int = 0 )
		{
			super(x, y, 0, 0, angle);
			this.size = size;
			this.life = Game.current_time;
			this.max_life = max_life;
 
			image_sprite = new Sprite();
			image_sprite.graphics.lineStyle(2, 0x333333);
			finished = false;
 
			random_offsets = new Array();
			random_sizes = new Array();
 
			var high:Number = 10 ;
			var low:Number = 0;
 
			var high2:int = 3;
			var low2:int = 1;
 
			for (var i:int = 0; i < num_points; i++)
			{
				var random_x:Number = Math.floor(Math.random() * (1 + high - low)) + low+i;
				var random_y:Number = Math.floor(Math.random() * (1 + high - low)) + low+1;
				random_offsets.push(new Point(random_x, random_y));
				random_sizes.push(Math.floor(Math.random() * (1 + high2 - low2)) + low2);
			}
 
		}
		override public function Render():void
		{
			//going to want to draw points around the outside of a circle of radius size, and have it increasing
			//so need to go around the circle (centered at x,y=0,0) and draw lines outward
 
			var selected_color:int = 16-Math.round((Game.current_time-life) / max_life*16);
			var color_val:String = selected_color.toString(16);
 
			var color:uint  = uint("0x" + color_val + color_val + color_val + color_val + color_val + color_val);
 
			for (var i:int = 0; i < num_points; i++)
			{
				Game.Renderer.fillRect(
				new Rectangle(
				x+size * Math.cos(((i + 1) * 360 / num_points) * (Math.PI / 180)) + random_offsets[i].x,
				y + size * Math.sin(((i + 1) * 360 / num_points) * (Math.PI / 180)) + random_offsets[i].y,
				random_sizes[i], random_sizes[i])
				,color);
			}
			size += ((max_life-(Game.current_time-life))/max_life)*5;
 
			super.Render();
		}
	}
}