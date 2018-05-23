package cwl.data;

import org.junit.Test;

import static org.junit.Assert.assertNotNull;

public class CustomerDataReaderTest {

    @Test
    public void testRead() throws Exception{
        String responseBody = CustomerDataReader.readResourceAsString("cwl/data/test.json");

        assertNotNull(responseBody);
    }
}
