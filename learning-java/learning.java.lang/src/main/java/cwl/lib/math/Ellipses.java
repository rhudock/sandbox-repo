/**
 * $\Id$
 * User: chealwoo
 * Date: Nov 30, 2010
 * Time: 12:48:11 PM
 * Copyright (c) Chealwoo Lee (Daniel) 2010, All rights reservedrved.
 */
package cwl.lib.math;

import javax.swing.JApplet;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.BasicStroke;
import java.awt.RenderingHints;
import java.awt.Graphics;
import java.awt.Dimension;
import java.awt.Frame;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.geom.Ellipse2D;
import java.awt.image.BufferedImage;

public class Ellipses extends JApplet implements Runnable {

    private static Color colors[] = { Color.blue, Color.cyan, Color.green,
                Color.magenta, Color.orange, Color.pink, Color.red,
                Color.yellow, Color.lightGray, Color.white };
    private Thread thread;
    private BufferedImage bimg;
    private Ellipse2D.Float[] ellipses;
    private double esize[];
    private float estroke[];
    private double maxSize;


    public void init() {
        setBackground(Color.black);

        // an array of type Ellipse2D.Float
        ellipses = new Ellipse2D.Float[25];

        // a double array initialized to the length of the ellipses array
        esize = new double[ellipses.length];

        // a float array initialized to the length of the ellipses array
        estroke = new float[ellipses.length];

        // fills the ellipses array with Ellipse2D.Float objects
        for (int i = 0; i < ellipses.length; i++) {
            ellipses[i] = new Ellipse2D.Float();
            // gets location for each ellipse with the given random size
            getRandomXY(i, 20 * Math.random(), 200, 200);
        }
    }


    /*
     * sets the bounds of the ellipse specified by i, using the given
     * width, height and random size.
     */
    public void getRandomXY(int i, double size, int w, int h) {
        esize[i] = size;
        estroke[i] = 1.0f;
        double x = Math.random() * (w-(maxSize/2));
        double y = Math.random() * (h-(maxSize/2));
        ellipses[i].setFrame(x, y, size, size);
    }


    /*
     * resets the bounds of the ellipses with the given width and height
     */
    public void reset(int w, int h) {
        maxSize = w/10;
        for (int i = 0; i < ellipses.length; i++ ) {
            getRandomXY(i, maxSize * Math.random(), w, h);
        }
    }


    /*
     * increase each stroke size and ellipse size until maxSize
     */
    public void step(int w, int h) {
        for (int i = 0; i < ellipses.length; i++) {
            estroke[i] += 0.025f;
            esize[i]++;
            if (esize[i] > maxSize) {
                getRandomXY(i, 1, w, h);
            } else {
                ellipses[i].setFrame(ellipses[i].getX(), ellipses[i].getY(),
                                     esize[i], esize[i]);
            }
        }
    }


    public void drawDemo(int w, int h, Graphics2D g2) {
        // sets the color and stroke size and draws each ellipse
        for (int i = 0; i < ellipses.length; i++) {
            g2.setColor(colors[i%colors.length]);
            g2.setStroke(new BasicStroke(estroke[i]));
            g2.draw(ellipses[i]);
        }
    }


    public Graphics2D createGraphics2D(int w, int h) {
        Graphics2D g2 = null;
        if (bimg == null || bimg.getWidth() != w || bimg.getHeight() != h) {
            bimg = (BufferedImage) createImage(w, h);
            reset(w, h);
        }
        g2 = bimg.createGraphics();
        g2.setBackground(getBackground());
        g2.clearRect(0, 0, w, h);
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                            RenderingHints.VALUE_ANTIALIAS_ON);
        return g2;
    }


    public void paint(Graphics g) {
        Dimension d = getSize();
        step(d.width, d.height);
        Graphics2D g2 = createGraphics2D(d.width, d.height);
        drawDemo(d.width, d.height, g2);
        g2.dispose();
        g.drawImage(bimg, 0, 0, this);
    }


    public void start() {
        thread = new Thread(this);
        thread.setPriority(Thread.MIN_PRIORITY);
        thread.start();
    }


    public synchronized void stop() {
        thread = null;
    }


    public void run() {
        Thread me = Thread.currentThread();
        while (thread == me) {
            repaint();
            try {
                thread.sleep(10);
            } catch (InterruptedException e) { break; }
        }
        thread = null;
    }


    public static void main(String argv[]) {
        final Ellipses demo = new Ellipses();
        demo.init();
        Frame f = new Frame("Java 2D(TM) Demo - Ellipses");
        f.addWindowListener(new WindowAdapter() {
            public void windowClosing(WindowEvent e) {System.exit(0);}
            public void windowDeiconified(WindowEvent e) { demo.start(); }
            public void windowIconified(WindowEvent e) { demo.stop(); }
        });
        f.add(demo);
        f.pack();
        f.setSize(new Dimension(400,300));
        f.show();
        demo.start();
    }
}
