/*
 * \$Id$
 * 
 * TextViewer.java - created on Dec 17, 2012 11:23:52 AM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package com.inq.skin.singleimg;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;

import javax.swing.plaf.metal.MetalIconFactory.FolderIcon16;

import javafx.application.Application;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.VBox;
import javafx.stage.DirectoryChooser;
import javafx.stage.FileChooser;
import javafx.stage.FileChooserBuilder;
import javafx.stage.Stage;

public class SingleHTML5UI extends Application {
	BorderPane root = new BorderPane();
	MenuBar mb = new MenuBar();
	VBox topVBox = new VBox();
	VBox centerBox = new VBox();
	TextArea fileTextArea = new TextArea();
	TextField fileName = new TextField();
	TextField imageFolderName = new TextField();

	public static void main(String[] args) {
		launch(args);
	}

	public void createCenter(Stage primaryStage) {
		// Create an VBox for the center
		centerBox.setPadding(new Insets(10, 10, 10, 10));
		final Stage link = primaryStage;

		Label centerLbl = new Label("Message");
		centerLbl.setStyle("-fx-font-size:14pt; -fx-font-weight:bold;");

		fileTextArea.setWrapText(true);
		fileTextArea.setPrefSize(200, 400);
		fileTextArea
				.setStyle("-fx-font-size:14pt; -fx-font-weight:bold; -fx-font-family:Monaco, 'Courier New', MONOSPACE");

		Button buttonCurrent = new Button("Select MXML File");
		buttonCurrent.setOnAction(new EventHandler<ActionEvent>() {
			@Override
			public void handle(ActionEvent Event) {
				String currentDir = System.getProperty("user.dir") + File.separator;
				StringBuilder sb = new StringBuilder("Hello");

				FileChooserBuilder fcb = FileChooserBuilder.create();
				FileChooser fc = fcb.title("Open Dialog").initialDirectory(new File(currentDir)).build();
				File selectedFile = fc.showOpenDialog(link);
				fileTextArea.setText(sb.toString());
				fileName.setText(selectedFile.getPath());
			}
		});

		Button buttonImageFolder = new Button("Select Image Folder");
		buttonImageFolder.setOnAction(new EventHandler<ActionEvent>() {
			@Override
			public void handle(ActionEvent Event) {
				String currentDir = System.getProperty("user.dir") + File.separator;
				StringBuilder sb = null;

				DirectoryChooser chooser = new DirectoryChooser();
				chooser.setTitle("JavaFX Projects");
				File defaultDirectory = new File(currentDir);
				chooser.setInitialDirectory(defaultDirectory);
				File selectedDirectory = chooser.showDialog(link);

				imageFolderName.setText(selectedDirectory.getPath());
			}
		});

		Button buttonExecute = new Button("Generate Single Image");
		buttonExecute.setOnAction(new EventHandler<ActionEvent>() {
			@Override
			public void handle(ActionEvent Event) {
				SingleHTML5ImageBuilder singleImgBuilder = new SingleHTML5ImageBuilder(
						imageFolderName.getText(), fileName.getText());
				singleImgBuilder.process();
			}
		});

		centerBox.getChildren().add(buttonCurrent);
		centerBox.getChildren().add(fileName);
		centerBox.getChildren().add(buttonImageFolder);
		centerBox.getChildren().add(imageFolderName);
		centerBox.getChildren().add(buttonExecute);
		centerBox.getChildren().add(centerLbl);
		centerBox.getChildren().add(fileTextArea);
	}

	@Override
	public void start(Stage primaryStage) {

		// Initialize Regions
		createCenter(primaryStage);

		// Combine components into final UI
		root.setTop(topVBox);
		root.setCenter(centerBox);
		primaryStage.setScene(new Scene(root, 800, 600));
		primaryStage.show();
	}
}
