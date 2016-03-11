package learning.java.ch05.classes;

/**
 * Pendulum Class That I would like to build more detail.
 * 
 * It is nice to watch how pendulum works - http://www.walter-fendt.de/ph11e/pendulum.htm
 * 
 * @author DLee
 *
 */
public class Pendulum {

    float mass;
    float length;// = 1.0;
    int cycles;
    
/* 
 * A pendulum is a mass that is attached to a pivot, 
 * from which it can swing freely. 
 * This object is subject to a restoring force due to gravity 
 * that will accelerate it toward an equilibrium position. 
 * When the pendulum is displaced from its place of rest, 
 * the restoring force will cause the pendulum to oscillate 
 * about the equilibrium position.
 * {http://en.wikipedia.org/wiki/Pendulum}
 *  
 * need to build demonstrates the variation of 
 * 	elongation, 
 * 	velocity, 
 * 	tangential acceleration, 
 * 	force and 
 * 	energy 
 * during the oscillation of a pendulum 
 * (assumed with no friction).
 */

    float getPosition ( float time ) {
        
    	return length;
    }

    public static void main (String args[])
    {
        Pendulum p;
        p = new Pendulum( );
        
        p.mass = 5.0F;
        float pos = p.getPosition( 1.0F );        
    }
}

