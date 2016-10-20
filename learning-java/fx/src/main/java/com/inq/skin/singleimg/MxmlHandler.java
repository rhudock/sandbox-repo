/*
 * \$Id$
 * 
 * ReadAllImages.java - created on Dec 12, 2012 9:25:20 AM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package com.inq.skin.singleimg;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.util.LinkedHashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Scanner;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author dlee
 * 
 */
public class MxmlHandler {

	private final static String REGEXP_IMG = "[-_./a-zA-Z0-9]*.gif|[-_./a-zA-Z0-9]*.png|[-_./a-zA-Z0-9]*.jpg";
	private final static String REGEXP_IMG_SHORT = "[-_.a-zA-Z0-9]*.gif|[-_.a-zA-Z0-9]*.png|[-_.a-zA-Z0-9]*.jpg";
	private final static String REGEXP_MXML_SHORT = "([-_.a-zA-Z0-9]*).mxml";

	private File mxmlFile = null;
	private String fileName = null;
	private StringBuffer content = null;
	private boolean hasImageMap = false;

	/**
	 * @param fileName
	 */
	public MxmlHandler(String fileName) {
		super();
		this.fileName = fileName;
		this.mxmlFile = new File(this.fileName);
		this.content = readFile(mxmlFile);
		this.hasImageMap = hasImageMap(findScriptElement(content));
	}
	
	/**
	 * @return the hasImageMap
	 */
	public boolean hasImageMap() {
		return hasImageMap;
	}

	/**
	 * Return all image file names in the mxml file
	 * 
	 * @return
	 */
	public Set<String> findImageFiles() {
		return findImageFilesFromContent(this.content, REGEXP_IMG);
	}

	/**
	 * Return a new single image name from mxml file name 
	 * 
	 * @return
	 */
	public String getSingleImageName() {
		return getNewImgNameFromMxml(fileName);
	}

	
	
	
	/**
	 * Return main part of the mxml file  
	 * 
	 * @param mxmlName
	 * @return
	 */
	public static String getNewImgNameFromMxml(String mxmlName) {
		Pattern pattern = Pattern.compile(REGEXP_MXML_SHORT);

		Matcher m = pattern.matcher(mxmlName);
		System.out.println("reading " + mxmlName);
		if (m.find()) {
			return m.group(1);
		}
		return null;
	}

	/**
	 * Return filename from full name
	 * 
	 * @param fullName
	 * @return
	 */
	public static String getShortImgFileName(String fullName) {
		Pattern pattern = Pattern.compile(REGEXP_IMG_SHORT);

		Matcher m = pattern.matcher(fullName);
		System.out.println("reading " + fullName);
		if (m.find()) {
			return m.group();
		}
		return null;
	}

	/**
	 * Return set of all image files from a content
	 * 
	 * @param content
	 * @param regexp
	 * @return
	 */
	public static Set<String> findImageFilesFromContent(StringBuffer content, String regexp) {
		Set<String> imageFiles = new LinkedHashSet<String>();
		Pattern pattern = Pattern.compile(regexp);

		Matcher m = pattern.matcher(content.toString());
		while (m.find()) {
			imageFiles.add(m.group());
		}
		return imageFiles;
	}

	public static boolean hasImageMap(String scriptElementStr) {
		return scriptElementStr.indexOf("html5map") > 0;
	}

	public static void addImageMap(StringBuffer cDATA, StringBuffer imageMap) {
		// TODO should be able to handle white space between } and ;
		int idxInsert = cDATA.lastIndexOf("};");
		cDATA.insert(idxInsert, imageMap);
	}

	/**
	 * Return script's cData string
	 * 
	 * @param f
	 * @return
	 */
	public static String findScriptElement(StringBuffer content) {

		String searchStart = "<mx:Script>";
		String searchEnd = "</mx:Script>";

		return content.substring(content.indexOf(searchStart), content.indexOf(searchEnd));
	}

	/**
	 * Update mxml file with new map.
	 * 
	 * @param newMapStr
	 *            - new map
	 */
	public void updateMxml(StringBuffer newMapStr) {
		addMapToMxml(this.content, newMapStr);
		saveMxml(this.fileName, this.content);
	}

	/**
	 * 
	 * 
	 * @param f
	 * @param newMapStr
	 */
	private static void addMapToMxml(StringBuffer mxmlContent, StringBuffer newMapStr) {
		int scriptStart = mxmlContent.indexOf("<mx:script");
		int scriptEnd = mxmlContent.indexOf("/mx:Script>", scriptStart);

		// TODO cover
		int objectEnd = mxmlContent.lastIndexOf("};", scriptEnd);

		mxmlContent.replace(objectEnd - 1, objectEnd - 1, newMapStr.toString());
	}

	/**
	 * Save stringBuff into a mxml file.
	 * 
	 * @param newFileName
	 * @param sBuf
	 */
	private static void saveMxml(String newFileName, StringBuffer sBuf) {
		OutputStream os;
		try {
			os = new FileOutputStream(newFileName);
			final PrintStream printStream = new PrintStream(os);
			printStream.print(sBuf.toString());
			printStream.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * Return StringBuffer contains whole file.
	 * 
	 * @param f
	 * @return
	 */
	public static StringBuffer readFile(File f) {

		Scanner in = null;

		StringBuffer fileStr = new StringBuffer();

		try {
			in = new Scanner(new FileReader(f));
			while (in.hasNextLine()) {
				fileStr.append(in.nextLine()).append("\n");
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				in.close();
			} catch (Exception e) { /* ignore */
			}
		}

		return fileStr;
	}
}
