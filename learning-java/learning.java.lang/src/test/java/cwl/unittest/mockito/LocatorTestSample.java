package cwl.unittest.mockito;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.awt.*;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;

/**
 * https://automationrhapsody.com/mock-junit-tests-mockito-example/
 */
@RunWith(MockitoJUnitRunner.class)
public class LocatorTestSample {

    private static final Point TEST_POINT = new Point(11, 11);

    @Mock
    private LocatorService locatorServiceMock;

    private Locator locatorUnderTest;

    @Before
    public void setUp() {
        when(locatorServiceMock.geoLocate(any(Point.class))).thenReturn(TEST_POINT);
        when(locatorServiceMock.geoLocateStr(anyString())).thenCallRealMethod();

        locatorUnderTest = new Locator(locatorServiceMock);


    }

    @Test
    public void testLocateWithServiceResult() {
        assertEquals(TEST_POINT, locatorUnderTest.locate(1, 1));
    }

    @Test
    public void testLocateService() {
        assertEquals(TEST_POINT, locatorUnderTest.locate(1, 1));
        assertEquals("test returned", locatorServiceMock.geoLocateStr("test"));
    }

    @Test
    public void testLocateLocalResult() {
        Point expected = new Point(1, 1);
        assertTrue(arePointsEqual(expected, locatorUnderTest.locate(-1, -1)));
    }

    private boolean arePointsEqual(Point p1, Point p2) {
        return p1.getX() == p2.getX()
                && p1.getY() == p2.getY();
    }
}