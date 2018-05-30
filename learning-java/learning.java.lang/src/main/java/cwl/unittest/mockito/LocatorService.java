package cwl.unittest.mockito;

import java.awt.*;

public class LocatorService {
    public Point geoLocate(Point point) {
        return point;
    }

    public String geoLocateStr(String input) {
        return input + " returned";
    }
}
