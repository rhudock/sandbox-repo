package
{

	/**
	 * ...
	 * @author Daniel Lee
	 */
	import entities.Asteroid;
	import entities.Bullet;
	import entities.Explosion;
	import entities.Ship;
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.Sprite;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.utils.getTimer;
 
	public class Game
	{
		public var bitmap:Bitmap;
		public static var Renderer:BitmapData;
 
		private var ship:Ship
 
		private var keys_down:Array
 
		private const LEFT:int = 37;
		private const UP:int = 38;
		private const RIGHT:int = 39;
		private const DOWN:int = 40;
		private const SPACE:int = 32;	
 
		public static var current_time:Number;
		private var bullets:Array;
		private var firing_delay:Number;
		private var last_fired:Number;
		private var bullets_max_life:Number;
 
		private var asteroids:Array;
 
		private var explosions:Array;
 
		public var mouse_down:Boolean;
		public var mouse_click:Boolean;
		public var mouse_pos:Point;
 
		public function Game(stageWidth:int, stageHeight:int)
		{
			trace("Game created");
			current_time = getTimer();
			Renderer = new BitmapData(stageWidth, stageHeight, false, 0x000000);
			bitmap = new Bitmap(Renderer);
 
			ship = new Ship(Renderer.width / 2 - 6, Renderer.height / 2 - 10, 10, 18);
 
			keys_down = new Array();
			bullets = new Array();
			firing_delay = 200;
			last_fired = 0;
			bullets_max_life = 1000;
 
			asteroids = new Array();
 
			//setup four first asteroids
			asteroids.push(new Asteroid(Renderer.width / 5, 2 * Renderer.height / 3, 0, 0, 1));
			asteroids.push(new Asteroid(Renderer.width / 5, Renderer.height / 4, 0, 1, 0));
 
			asteroids.push(new Asteroid(2*Renderer.width / 3, 1 * Renderer.height / 3, 0, 2, 1));
			asteroids.push(new Asteroid(2*Renderer.width / 3, 5 * Renderer.height / 5, 0, 3, 0));
 
			explosions = new Array();
 
		}
		public function Render():void
		{
			Renderer.lock();
			Renderer.fillRect(new Rectangle(0, 0, Renderer.width, Renderer.height), 0x000000);
 
			ship.Render();
			for (var i:int = 0; i < bullets.length; i++)
				bullets[i].Render();
 
			for (var j:int = 0; j < asteroids.length; j++)
				asteroids[j].Render();
 
			for (var k:int = 0; k < explosions.length; k++)
				explosions[k].Render();
 
			Renderer.unlock();
		}
 
		public function Update():void
		{
			current_time = getTimer();
 
			if (ship.visible)
			{
				if (CheckKeyDown(LEFT))
					ship.RotateLeft();
 
				if (CheckKeyDown(RIGHT))
					ship.RotateRight();
 
				if (CheckKeyDown(UP))
					ship.Thrust(1);
				if (CheckKeyDown(DOWN))
					ship.Thrust( -1);				
 
				if (CheckKeyDown(SPACE) && current_time-last_fired > firing_delay)
				{
					var x:int = 0 * Math.cos(ship.angle) + ship.rotate_offset.y * Math.sin(ship.angle)+ship.x+ship.rotate_offset.x;
					var y:int = 0 * Math.sin(ship.angle) - ship.rotate_offset.y * Math.cos(ship.angle)+ship.y+ship.rotate_offset.y;
 
					bullets.push(new Bullet(x, y, current_time, ship.angle));
					last_fired = current_time;
				}
				ship.Update();
			}
 
			var bullets_to_delete:Array = new Array();
			for (var i:int = 0; i < bullets.length; i++)
			{
				bullets[i].Update();
				if (current_time-bullets[i].life > bullets_max_life)
				{
					bullets_to_delete.push(i);
					continue;
				}
 
				var asteroid_hit:int = -1;
				for (var i2:int = 0; i2 < asteroids.length;i2++)
					if (bullets[i].CheckIfInNonRotatedRect(asteroids[i2]))
					{
						asteroid_hit = i2;
						break;
					}
				if (asteroid_hit != -1)
				{
					DestroyAsteroid(asteroid_hit);
					bullets_to_delete.push(i);
				}
			}
			for (var j:int = 0; j < bullets_to_delete.length;j++ )
			{
				bullets.splice(bullets_to_delete[j], 1);
			}
			var asteroid_ship_hit:int = -1;
			for (var k:int = 0; k < asteroids.length; k++ )
			{
				asteroids[k].Update();
				if (ship.CheckIfInNonRotatedRect(asteroids[k]))
				{
					asteroid_ship_hit = k;
					break;
				}
			}
			if (asteroid_ship_hit != -1)
			{
				ship.visible = false;
				explosions.push(new Explosion(ship.x, ship.y, 1500,2));
				explosions.push(new Explosion(ship.x, ship.y, 500));
				DestroyAsteroid(asteroid_ship_hit);
			}
 
			var explosions_to_delete:Array = new Array();
			for (var m:int = 0; m < explosions.length;m++ )
				if (current_time-explosions[m].life > explosions[m].max_life)
					explosions_to_delete.push(m);
			for (var n:int = 0; n < explosions_to_delete.length; n++)
				explosions.splice(explosions_to_delete[n], 1);
 
		}
		public function DestroyAsteroid(asteroid_hit:int):void
		{
			explosions.push(new Explosion(
			asteroids[asteroid_hit].x + asteroids[asteroid_hit].width / 2,
			asteroids[asteroid_hit].y + asteroids[asteroid_hit].height / 2, 1000, asteroids[asteroid_hit].width/4));	
 
			//now delete the old asteroid, and add 2 new ones in it's place if there are any more sizes left
			var old_asteroid:Asteroid = asteroids[asteroid_hit];
			//if there are more sizes to chose from
			if (old_asteroid.size != Asteroid.Sizes.length - 1)
			{
 
				var rand_dir:int = Math.floor(Math.random() * (1 + Asteroid.Directions.length - 1 ));
 
				var rand_dir2:int = rand_dir - 2;
				if (rand_dir - 2 < 0)
					rand_dir2 = rand_dir + 2;
 
				var rand_type:int = Math.floor(Math.random() * (1 + Asteroid.Types.length - 1 ));
				var rand_type2:int = Math.floor(Math.random() * (1 + Asteroid.Types.length - 1 ));
 
				//add 2 new asteroids at half the size
				asteroids.push(new Asteroid(
				old_asteroid.x,
				old_asteroid.y,
				old_asteroid.size + 1,
				rand_dir,
				rand_type));
 
				asteroids.push(new Asteroid(
				old_asteroid.x,
				old_asteroid.y,
				old_asteroid.size + 1,
				rand_dir2,
				rand_type2));
			}
			asteroids.splice(asteroid_hit, 1);
		}
		public function KeyUp(e:KeyboardEvent):void
		{
			//trace(e.keyCode);
			//position of key in the array
			var key_pos:int = -1;
			for (var i:int = 0; i < keys_down.length; i++)
				if (e.keyCode == keys_down[i])
				{
					//the key is found/was pressed before, so store the position
					key_pos = i;
					break;
				}
			//remove the keycode from keys_down if found
			if(key_pos!=-1)
				keys_down.splice(key_pos, 1);
		}
 
		public function KeyDown(e:KeyboardEvent):void
		{
			//check to see if the key that is being pressed is already in the array of pressed keys
			var key_down:Boolean = false;
			for (var i:int = 0; i < keys_down.length; i++)
				if (keys_down[i] == e.keyCode)
					key_down = true;
 
			//add the key to the array of pressed keys if it wasn't already in there
			if (!key_down)
				keys_down.push(e.keyCode);
		}
 
		public function CheckKeyDown(keycode:int):Boolean
		{
			var answer:Boolean = false;
			for (var i:int = 0; i < keys_down.length; i++)
				if (keys_down[i] == keycode)
				{
					answer = true;
					break;
				}
			return answer;
		}
	}
}