package cwl.net.springrestclient;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.web.client.AsyncRestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public class FooAsyncClient {

    public static void main(String[] args) {
        postFoo();
    }

    public static void postFoo() {
        AsyncRestTemplate asycTemp = new AsyncRestTemplate();
        String url = "http://localhost:8082/spring-rest/foos";
        HttpMethod method = HttpMethod.GET;

        //create request entity using HttpHeaders
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);

        HttpEntity<String> requestEntity = new HttpEntity<String>("{ \"id\": 10, \"name\": \"Ten\" }", headers);

        Map<String, String> urlVariable = new HashMap<String, String>();
        urlVariable.put("id", "10");
        urlVariable.put("name", "Ten");

        ListenableFuture<ResponseEntity<String>> future = asycTemp.postForEntity(url, requestEntity, String.class, urlVariable);
        try {
            //waits for the result
            ResponseEntity<String> result = future.get();
            System.out.println(result);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }
}
