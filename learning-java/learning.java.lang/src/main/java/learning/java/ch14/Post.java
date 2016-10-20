package learning.java.ch14;
//file: Post.java
import java.net.*;
import java.io.*;
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;

public class Post extends JPanel implements ActionListener {
  JTextField nameField, passwordField;
  String postURL;

  GridBagConstraints constraints = new GridBagConstraints(  );
  void addGB( Component component, int x, int y ) {
    constraints.gridx = x;  constraints.gridy = y;
    add ( component, constraints );
  }

  public Post( String postURL ) {
    this.postURL = postURL;
    JButton postButton = new JButton("Post");
    postButton.addActionListener( this );
    setLayout( new GridBagLayout(  ) );
    addGB( new JLabel("Name:"), 0,0 );
    addGB( nameField = new JTextField(20), 1,0 );
    addGB( new JLabel("Password:"), 0,1 );
    addGB( passwordField = new JPasswordField(20),1,1 );
    constraints.gridwidth = 2;
    addGB( postButton, 0,2 );
  }

  public void actionPerformed(ActionEvent e) {
    postData(  );
  }

  protected void postData(  ) {
    StringBuffer sb = new StringBuffer(  );
    sb.append( URLEncoder.encode("Name") + "=" );
    sb.append( URLEncoder.encode(nameField.getText(  )) );
    sb.append( "&" + URLEncoder.encode("Password") + "=" );
    sb.append( URLEncoder.encode(passwordField.getText(  )) );
    String formData = sb.toString(  );

    try {
      URL url = new URL( postURL );
      HttpURLConnection urlcon =
          (HttpURLConnection) url.openConnection(  );
      urlcon.setRequestMethod("POST");
      urlcon.setRequestProperty("Content-type",
          "application/x-www-form-urlencoded");
      urlcon.setDoOutput(true);
      urlcon.setDoInput(true);
      PrintWriter pout = new PrintWriter( new OutputStreamWriter(
          urlcon.getOutputStream(  ), "8859_1"), true );
      pout.print( formData );
      pout.flush(  );

      // read results...
      if ( urlcon.getResponseCode(  ) != HttpURLConnection.HTTP_OK )
        System.out.println("Posted ok!");
      else {
        System.out.println("Bad post...");
        return;
      }
      //InputStream in = urlcon.getInputStream(  );
      // ...

    } catch (MalformedURLException e) {
      System.out.println(e);     // bad postURL
    } catch (IOException e2) {
      System.out.println(e2);    // I/O error
    }
  }

  public static void main( String [] args ) {
    JFrame frame = new JFrame("SimplePost");
    frame.getContentPane(  ).add( new Post( args[0] ), "Center" );
    frame.pack(  );
    frame.setVisible(true);
  }
}
