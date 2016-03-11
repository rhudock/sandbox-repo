/*
 * \$Id$
 * 
 * SingleHTML5ImageBuilder.java - created on Dec 12, 2012 11:34:59 AM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package com.inq.skin.singleimg;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

/**
 * @author dlee
 * 
 */
public class SingleHTML5ImageBuilder {

	private BufferedImage singleImage = null;
	private Map<String, ImagePoint> imagePointMap = new TreeMap<String, ImagePoint>();

	private String dirName = null;

	Set<String> imageFileSet = null;
	Map<String, BufferedImage> imageMap = null;

	MxmlHandler mxmlHandler = null;

	StringBuffer html5map = new StringBuffer(",\n" + "html5map: 				{\n"
			+ "/*  This is the map to map graphic urls to sprites\n"
			+ " *  All references to graphic urls in this MXML are mapped below to a sprite url.\n"
			+ " * 	@Embed format for sprites is:\n" + " *		@Embed(uri, left-offset, top-offset, width, height);\n"
			+ " *  This map must be computer generated when this skin is uploaded in portal\n" + " */\n");

	/**
	 * 
	 * @param dirName
	 * @param mxmlName
	 */
	public SingleHTML5ImageBuilder(String dirName, String mxmlName) {
		super();
		this.dirName = dirName;

		this.mxmlHandler = new MxmlHandler(mxmlName);
	}

	/**
	 * 
	 */
	public void process() {
		
		if (this.mxmlHandler.hasImageMap()) {
			System.out.println("INFO: the mxml file already has imageMap. Remove it and Try again.");
			return;
		}
		
		// 1. Read all image files from mxml.
		this.imageFileSet = this.mxmlHandler.findImageFiles();

		// 2. Load all the images.
		this.imageMap = ImageHandler.getImageMap(this.dirName, this.imageFileSet);

		// 3. Build Single Image
		this.buildSingleImage();

		// 4. Build image map and Update mxml file
		this.buildHTML5map();
		this.updateMxml();
	}

	/**
	 * 
	 * @param imageMap
	 */
	public void buildSingleImage() {

		// define max and positon.
		int maxWidth = 0, maxHeight = 0;
		int positionWidth = 0, positionHeight = 0;

		// Build map
		for (String i : imageMap.keySet()) {

			// Read image info
			BufferedImage image = imageMap.get(i);

			int imgWidth = image.getWidth();
			int imgHeight = image.getHeight();

			// build html5 image map
			this.imagePointMap.put(i, new ImagePoint(positionWidth, positionHeight, imgWidth, imgHeight));
			positionHeight = positionHeight + imgHeight;

			// Calculate width and height
			maxHeight += imgHeight;

			if (imgWidth > maxWidth) {
				maxWidth = imgWidth;
			}
		}

		// Create Single Image.
		this.singleImage = new BufferedImage(maxWidth, maxHeight, BufferedImage.TYPE_INT_ARGB);
		Graphics2D g = this.singleImage.createGraphics();

		for (String str : this.imageMap.keySet()) {

			BufferedImage image = this.imageMap.get(str);
			ImagePoint ipoint = this.imagePointMap.get(str);

			g.drawImage(image, ipoint.getLeft_offset(), ipoint.getTop_offset(), ipoint.getSecondWidth(),
					ipoint.getSecondHeight(), 0, 0, ipoint.getWidth(), ipoint.getHeight(), null);
		}

		ImageHandler.saveImage(this.dirName + "\\" + this.mxmlHandler.getSingleImageName() + ".png", singleImage);

	}

	/**
	 * Building image map
	 * 
	 */
	public void buildHTML5map() {
		for (String str : this.imageMap.keySet()) {
			ImagePoint ipoint = this.imagePointMap.get(str);
			this.html5map.append(String.format("\t\t\"@Embed('%s')\":		\"@Embed('%s',%d,%d,%d,%d)\",\n", str,
					"./TouchCommerceMinimize/TouchCommerceMinimize.png", ipoint.getLeft_offset(),
					ipoint.getTop_offset(), ipoint.getWidth(), ipoint.getHeight()));
		}

		this.html5map.replace(this.html5map.lastIndexOf(","), this.html5map.lastIndexOf(",") + 1, "");
		this.html5map.append("				/* End of html5map */}\n");
	}

	/**
	 * update mxml file with new map.
	 */
	public void updateMxml() {
		this.mxmlHandler.updateMxml(this.html5map);
	}

	/**
	 * Simple inner class has image offset and size information.
	 * 
	 * 
	 * @author dlee
	 * 
	 */
	class ImagePoint {
		private int left_offset, top_offset, width, height;

		public ImagePoint(int left_offset, int top_offset, int width, int height) {
			this.left_offset = left_offset;
			this.top_offset = top_offset;
			this.width = width;
			this.height = height;
		}

		/**
		 * @return the left_offset
		 */
		public int getLeft_offset() {
			return left_offset;
		}

		/**
		 * @return the top_offset
		 */
		public int getTop_offset() {
			return top_offset;
		}

		/**
		 * @return the width
		 */
		public int getWidth() {
			return width;
		}

		/**
		 * @return the height
		 */
		public int getHeight() {
			return height;
		}

		public int getSecondWidth() {
			return left_offset + width;
		}

		public int getSecondHeight() {
			return top_offset + height;
		}
	}


	/**
	 * @param args
	 */
	public static void main(String[] args) {
		
		// TODO Add argument passing.
		//
		// Image folder, mxml file.

		SingleHTML5ImageBuilder singleImgBuilder = new SingleHTML5ImageBuilder(
				"C:\\JiraTickets\\TouchCommerceMinimize-html5\\TouchCommerceMinimize-html5",
				"c:\\JiraTickets\\TouchCommerceMinimize-html5\\TouchCommerceMinimize-html5.mxml");

		singleImgBuilder.process();
	}

}
