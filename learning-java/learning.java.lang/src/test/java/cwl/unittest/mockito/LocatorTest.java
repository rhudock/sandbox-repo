package cwl.unittest.mockito;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.runners.MockitoJUnitRunner;
import org.mockito.stubbing.Answer;

import java.awt.*;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class LocatorTest {

    @Mock
    private LocatorService locatorServiceMock;

    @Before
    public void setUp() throws Exception {
        // MockitoAnnotations.initMocks(this);
    }

    @Test
    public void locateTest01() throws Exception {
        when(locatorServiceMock.geoLocate(any(Point.class)))
                .thenReturn(new Point(11, 11));

        verify(locatorServiceMock, times(1)).geoLocate(new Point(1, 1));

        verifyNoMoreInteractions(locatorServiceMock);

    }

    @Test
    public void locateTest02() throws Exception {
        when(locatorServiceMock.geoLocate(new Point(5, 5))).thenReturn(new Point(50, 50));
        when(locatorServiceMock.geoLocate(new Point(1, 1))).thenReturn(new Point(11, 11));
    }

    @Test
    public void locateTest03() throws Exception {
        when(locatorServiceMock.geoLocate(any(Point.class)))
                .thenAnswer(new Answer<Point>() {
                    @Override
                    public Point answer(InvocationOnMock invocationOnMock) throws Throwable {
                        Object[] args = invocationOnMock.getArguments();
                        Point caller = (Point) args[0];

                        if (caller.getX() == 5 && caller.getY() == 5) {
                            return new Point(50, 50);
                        } else if (caller.getX() == 1 && caller.getY() == 1) {
                            return new Point(11, 11);
                        } else {
                            return null;
                        }
                    }
                });
    }

}