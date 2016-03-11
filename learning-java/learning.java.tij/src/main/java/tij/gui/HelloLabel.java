package tij.gui; //: gui/HelloLabel.java
import java.util.concurrent.TimeUnit;

import javax.swing.JFrame;
import javax.swing.JLabel;

public class HelloLabel {
  public static void main(String[] args) throws Exception {
    JFrame frame = new JFrame("Hello Swing");
    JLabel label = new JLabel("A Label");
    frame.add(label);
    frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    frame.setSize(300, 100);
    frame.setVisible(true);
    TimeUnit.SECONDS.sleep(1);
    label.setText("Hey! This is Different!");
  }
} ///:~
