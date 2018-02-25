package cwl.unittest.mockito.basic;

import org.hamcrest.BaseMatcher;
import org.hamcrest.Description;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.Iterator;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.argThat;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * https://gojko.net/2009/10/23/mockito-in-six-easy-examples/
 */
@RunWith(MockitoJUnitRunner.class)
public class BasicTest {

     @Test
     public void iterator_will_return_hello_world(){
         //arrange
         Iterator i=mock(Iterator.class);
         when(i.next()).thenReturn("Hello").thenReturn("World");
         //act
         String result=i.next()+" "+i.next();
         //assert
         assertEquals("Hello World", result);
     }

    @Test
    public void with_arguments(){
        Comparable c=mock(Comparable.class);
        when(c.compareTo("Test")).thenReturn(1);
        assertEquals(1,c.compareTo("Test"));
    }

    @Test
    public void with_unspecified_arguments(){
        Comparable c=mock(Comparable.class);
        when(c.compareTo(anyInt())).thenReturn(-1);
        assertEquals(-1,c.compareTo(5));
    }

    @Test(expected=IOException.class)
    public void OutputStreamWriter_rethrows_an_exception_from_OutputStream()
            throws IOException{
        OutputStream mock=mock(OutputStream.class);
        OutputStreamWriter osw=new OutputStreamWriter(mock);
        doThrow(new IOException()).when(mock).close();
        osw.close();
    }

    @Test
    public void OutputStreamWriter_Closes_OutputStream_on_Close()
            throws IOException{
        OutputStream mock=mock(OutputStream.class);
        OutputStreamWriter osw=new OutputStreamWriter(mock);
        osw.close();
        verify(mock).close();
    }

    @Test
    public void OutputStreamWriter_Buffers_And_Forwards_To_OutputStream()
            throws IOException{
        OutputStream mock=mock(OutputStream.class);
        OutputStreamWriter osw=new OutputStreamWriter(mock);
        osw.write('a');
        osw.flush();
        // can't do this as we don't know how long the array is going to be
        // verify(mock).write(new byte[]{'a'},0,1);

        BaseMatcher<byte []> arrayStartingWithA=new BaseMatcher(){
            @Override
            public void describeTo(Description description) {
                // nothing
            }
            // check that first character is A
            @Override
            public boolean matches(Object item) {
                byte[] actual=(byte[]) item;
                return actual[0]=='a';
            }
        };
        // check that first character of the array is A,
        // and that the other two arguments are 0 and 1
        verify(mock).write(argThat(arrayStartingWithA), eq(0),eq(1));
    }
}