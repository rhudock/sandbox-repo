package cwl.learn.lang.string;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class StringJoinerTest {

	@Before
	public void setup() {
	}
	
	@After
	public void teardown() {
	}

	@Test
	public void stringJoinEqualTest() {
		String result = String.join("-", "2015", "10", "31" );
		List<String> list = Arrays.asList("2015", "10", "31" );
		String resultCol = String.join("-", list);

		assertEquals(result, resultCol);
	}

	@Test
	public void stringJoinerEqualTest() {
		String result = String.join("-", "2015", "10", "31" );

		List<String> list = Arrays.asList("2015", "10", "31" );
		String resultJoin = list.stream().collect(Collectors.joining("-"));

		assertEquals(result, resultJoin);
	}

    @Test
    public void stringJoinerMapEqualTest() {
        Map<String, String> headerMock = new HashMap<>();
        for(int i=0; i<10; i++){
            headerMock.put(Integer.toString(i), Integer.toString(i) + " value");
        }

        String result = headerMock.keySet().stream().map(headerKey -> headerKey + ":" + headerMock.get(headerKey)).collect(Collectors.joining(", "));

        String expected = "0:0 value, 1:1 value, 2:2 value, 3:3 value, 4:4 value, 5:5 value, 6:6 value, 7:7 value, 8:8 value, 9:9 value";

        assertEquals(expected, result);
    }

    @Test
    public void stringJoinerObjectEqualTest() {
        MyObject[] myObjects;
        myObjects = new MyObject[10];
        for(int i=0; i<10; i++){
            myObjects[i] = new MyObject(Integer.toString(i), Integer.toString(i) + " value");
        }

        String result =  Arrays.stream(myObjects).map(header -> header.getName() + ":" + header.getValue() )
                .collect(Collectors.joining(", "))
                ;

        String expected = "0:0 value, 1:1 value, 2:2 value, 3:3 value, 4:4 value, 5:5 value, 6:6 value, 7:7 value, 8:8 value, 9:9 value";

        assertEquals(expected, result);
    }

    public class MyObject {
	    private String name;
	    private String value;
	    MyObject(String name, String value){
	        this.name = name;
	        this.value = value;
        }

        public String getName() {
            return name;
        }

        public String getValue() {
            return value;
        }
    }
}
