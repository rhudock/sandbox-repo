package cwl.async;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

//import static org.hamcrest.CoreMatchers.;
/**
 * Spring 3.2.x use these  Spring 3.1.x use these
 */
/** Spring 3.1.x use these */
//import static org.springframework.test.web.client.match.RequestMatchers.method;
//import static org.springframework.test.web.client.match.RequestMatchers.requestTo;
//import static org.springframework.test.web.client.response.ResponseCreators.withServerError;
//import static org.springframework.test.web.client.response.ResponseCreators.withStatus;
//import static org.springframework.test.web.client.response.ResponseCreators.withSuccess;



//@ContextConfiguration(locations = {"classpath:/applicationContext-test.xml"})
public class SimpleRestServiceTest extends AbstractJUnit4SpringContextTests {
    @Autowired
    private SimpleRestService simpleRestService;

    @Autowired
    private RestTemplate restTemplate;

    private MockRestServiceServer mockServer;

    @Before
    public void setUp() {
        mockServer = MockRestServiceServer.createServer(restTemplate);
    }

    @Test
    public void testGetMessage() {
        mockServer.expect(requestTo("http://google.com")).andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess("resultSuccess", MediaType.TEXT_PLAIN));

        String result = simpleRestService.getMessage();

        mockServer.verify();
//        assertThat(result, allOf(containsString("SUCCESS"), containsString("resultSuccess")));
    }

    @Test
    public void testGetMessage_500() {
        mockServer.expect(requestTo("http://google.com")).andExpect(method(HttpMethod.GET))
                .andRespond(withServerError());

        String result = simpleRestService.getMessage();

        mockServer.verify();
//        assertThat(result, allOf(containsString("FAILED"), containsString("500")));
    }

    @Test
    public void testGetMessage_404() {
        mockServer.expect(requestTo("http://google.com")).andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.NOT_FOUND));

        String result = simpleRestService.getMessage();

        mockServer.verify();
//        assertThat(result, allOf(containsString("FAILED"), containsString("404")));
    }
}