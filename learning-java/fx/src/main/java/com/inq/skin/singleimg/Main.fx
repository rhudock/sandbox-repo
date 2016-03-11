/*
*Main.fx
*
*Created on Dec 14, 2012, 13:40:52 PM
*/

package com.inq.skin.singleimg;

import javafx.scene.Scene;
import javafx.scene.text.Font;
import javafx.scene.text.Text;
import javafx.stage.Stage;

Stage {
    title: "Application"
    width: 250 height: 100
    scene: Scene {
        content: [ 
            Text {
                x:0 y:14
                content: "Hello world!"
                font: Font {name: "Arial" size: 14}
           }
        ]
    }
};
