package cwl.unittest.mockito.annotation;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.List;

import static org.junit.Assert.assertEquals;

/*
Source: http://www.baeldung.com/mockito-annotations

ArgumentCaptor : https://static.javadoc.io/org.mockito/mockito-core/2.2.9/org/mockito/ArgumentCaptor.html
Use it to capture argument values for further assertions.
Mockito verifies argument values in natural java style: by using an equals() method. This is also the recommended way of matching arguments because it makes tests clean & simple. In some situations though, it is helpful to assert on certain arguments after the actual verification. For example:

Advence example @see com.inq.api.plugins.onetomany.controller.OneToManyChatControllerTest
 */
@RunWith(MockitoJUnitRunner.class)
public class CaptorAnnotation {

    @Test
    public void whenNotUseCaptorAnnotation_thenCorrect() {
        List mockList = Mockito.mock(List.class);
        ArgumentCaptor<String> arg = ArgumentCaptor.forClass(String.class);

        mockList.add("one");
        Mockito.verify(mockList).add(arg.capture());

        assertEquals("one", arg.getValue());
    }

    @Mock
    List mockedList;

    @Captor
    ArgumentCaptor argCaptor;

    @Test
    public void whenUseCaptorAnnotation_thenTheSam() {
        mockedList.add("one2");
        Mockito.verify(mockedList).add(argCaptor.capture());

        assertEquals("one2", argCaptor.getValue());
    }
}
