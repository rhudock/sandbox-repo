/*
 * \$Id$
 * 
 * BuildImageMap.java - created on Dec 12, 2012 10:50:09 AM
 * Copyright (c)2011, Chealwoo Lee (Daniel). All rights reserved. Use is subject to license terms.
 */
package com.inq.skin.singleimg;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import javax.imageio.ImageIO;

/**
 * @author dlee
 * 
 */
public class ImageHandler {

	/**
	 * Return Map of image name and image file.
	 * 
	 * @param dirName
	 *            - Where all the files are located.
	 * @param imageFileSet
	 *            - Set of image files
	 * @return
	 */
	public static Map<String, BufferedImage> getImageMap(String dirName, Set<String> imageFileSet) {

		Map<String, BufferedImage> imageMap = new TreeMap<String, BufferedImage>();

		for (String s : imageFileSet) {

			BufferedImage tmpImg = loadImage(dirName + "\\" + MxmlHandler.getShortImgFileName(s));

			if (null != tmpImg) {
				imageMap.put(s, tmpImg);
			}
		}

		return imageMap;
	}

	/**
	 * Return BufferedImage from file name.
	 * 
	 * @param fileName
	 * @return
	 */
	private static BufferedImage loadImage(String fileName) {
		BufferedImage img = null;
		try {
			img = ImageIO.read(new File(fileName));
		} catch (IOException e) {
			System.out.println("no image file;" + fileName);
		}
		return img;
	}

	/**
	 * save image into a filename
	 * 
	 * @param fileName
	 * @param bi
	 */
	public static void saveImage(String fileName, BufferedImage bi) {
		try {
			// retrieve image
			File outputfile = new File(fileName);
			ImageIO.write(bi, "png", outputfile);
		} catch (IOException e) {
			System.out.println("Cannot save image file;" + fileName);
		}
	}

}
