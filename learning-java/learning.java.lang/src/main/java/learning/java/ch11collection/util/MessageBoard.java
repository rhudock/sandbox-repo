/**
 * \$Id: MessageBoard.java 16 2009-05-20 02:05:45Z daniel $
 * MessageBoard
 * Version: DLee
 * Date: Mar 12, 2009  Time: 11:52:52 AM
 * Copyright (c) Nomadix 2009, All rights reserved.
 * To change this template use File | Settings | File Templates.
 */
package learning.java.ch11collection.util;

import java.util.Observable;
import java.util.Observer;

public class MessageBoard extends Observable {
    private String message;

    public String getMessage() {
        return message;
    }

    public void changeMessage(String message) {
        this.message = message;
        setChanged();
        notifyObservers(message);
    }

    public static void main(String[] args) {
        MessageBoard board = new MessageBoard();
        Student bob = new Student();
        Student joe = new Student();
        board.addObserver(bob);
        board.addObserver(joe);
        board.changeMessage("More Homework!");
    }
} // end of class MessageBoard

class Student implements Observer {
    public void update(Observable o, Object arg) {
        System.out.println("Message board changed: " + arg);
    }
}