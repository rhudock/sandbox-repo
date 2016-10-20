package learning.java.ch24.sax;

import java.lang.reflect.Method;
import java.util.Stack;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

public class SAXModelBuilder extends DefaultHandler
{
    Stack<SimpleElement> stack = new Stack<SimpleElement>();
	SimpleElement element;

    public void startElement(
        String namespace, String localname, String qname, Attributes atts ) 
		throws SAXException
	{
		SimpleElement element = null;
		System.out.println("startElement qname: " + qname);
        try {
            element = (SimpleElement)Class.forName("learning.java._24sax." + qname).newInstance();
        } catch ( Exception e ) {System.out.println("  startElement Exception can not find Class " + qname); }
        if ( element == null ) 
			element = new SimpleElement();
		for(int i=0; i<atts.getLength(); i++)
			element.setAttributeValue( atts.getQName(i), atts.getValue(i) );
        stack.push( element );
    }

	public void endElement( String namespace, String localname, String qname ) 
		throws SAXException
	{
		System.out.println("endElement qname: " + qname);
		element = stack.pop();
		if ( !stack.empty() )
			try {
				setProperty( qname, stack.peek(), element );
			} catch ( Exception e ) { throw new SAXException( "Error: "+e ); }
	}

	public void characters(char[] ch, int start, int len ) {
		String text = new String( ch, start, len );
		stack.peek().addText( text );
	}

    void setProperty( String name, Object target, Object value ) 
		throws SAXException 
	{
		System.out.println("  setProperty name: " + name);
    	
		Method method = null;
		try { 
			method = target.getClass().getMethod("add"+name, value.getClass());
		} catch ( NoSuchMethodException e ) { }
		if ( method == null ) try { 
			method = target.getClass().getMethod("set"+name, value.getClass());
		} catch ( NoSuchMethodException e ) { }
		if ( method == null ) try { 
			value = ((SimpleElement)value).getText();
			method = target.getClass().getMethod( "add"+name, String.class );
		} catch ( NoSuchMethodException e ) { }
		try {
			if ( method == null )
				method = target.getClass().getMethod("set"+name, String.class);
			method.invoke( target, value );
		} catch ( Exception e ) { throw new SAXException( e.toString() ); }
	}

	public SimpleElement getModel() { return element; }
}

