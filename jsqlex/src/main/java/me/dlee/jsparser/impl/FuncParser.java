package me.dlee.jsparser.impl;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import me.dlee.jsparser.InqFrameworkParserService;

public class FuncParser implements InqFrameworkParserService {

	private static Pattern l_pattern = Pattern.compile("(com.inq.flash.client.chatskins.ScrollMonitor.*)=.*function.*");

	@Override
	public List<String> parseIt(List<String> inqjs) {

		int countFunction = 0;
		
		String jsThis = "";
		for (String s : inqjs) {
			if(s.startsWith("function ") || s.contains("= function(")){
				jsThis = s;
				countFunction++;
			}
			
			Matcher matcher = l_pattern.matcher(s);
			if(matcher.find()) {
				String subs = matcher.group(1);
				System.out.println(s + "      found " + subs);
			}
		}
		System.out.println("function count:" + countFunction);
		
		return null;
	}

}
