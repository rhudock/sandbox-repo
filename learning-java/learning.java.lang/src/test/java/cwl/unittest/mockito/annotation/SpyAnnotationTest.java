package cwl.unittest.mockito.annotation;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

/**
 * https://static.javadoc.io/org.mockito/mockito-core/2.2.9/org/mockito/Spy.html
 */
@RunWith(MockitoJUnitRunner.class)
public class SpyAnnotationTest {

    //Instance for spying is created by calling constructor explicitly:
    @Spy
    Foo spyOnFoo = new Foo("argument");
    //Instance for spying is created by mockito via reflection (only default constructors supported):
//    @Spy
//    Bar spyOnBar;

    @Test
    public void apiTest() {
        List list = new LinkedList();
        List spy = spy(list);

        //Impossible: real method is called so spy.get(0) throws IndexOutOfBoundsException (the list is yet empty)
//        when(spy.get(0)).thenReturn("foo");

        //You have to use doReturn() for stubbing
        doReturn("foo").when(spy).get(0);
    }

    /*
    @spy
     */
    @Test
    public void whenNotUseSpyAnnotation_thenCorrect() {
        List<String> spyList = spy(new ArrayList<String>());

        spyList.add("one");
        spyList.add("two");

        Mockito.verify(spyList).add("one");
        Mockito.verify(spyList).add("two");

        assertEquals(2, spyList.size());

        doReturn(100).when(spyList).size();
        assertEquals(100, spyList.size());
    }

    @Spy
    List<String> spiedList = new ArrayList<String>();

    @Test
    public void whenUseSpyAnnotation_thenSpyIsInjected() {
        spiedList.add("one");
        spiedList.add("two");

        Mockito.verify(spiedList).add("one");
        Mockito.verify(spiedList).add("two");

        assertEquals(2, spiedList.size());

        doReturn(100).when(spiedList).size();
        assertEquals(100, spiedList.size());
    }

    public class Bar {
        private Bar() {
        }

        public Bar(String publicConstructorWithOneArg) {
        }
    }

    public class Foo {
        private Foo() {
        }

        public Foo(String publicConstructorWithOneArg) {
        }
    }
}
