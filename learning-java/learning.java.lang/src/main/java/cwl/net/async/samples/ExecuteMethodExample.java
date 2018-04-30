package cwl.net.async.samples;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.AsyncClientHttpRequest;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Controller;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.web.client.AsyncRequestCallback;
import org.springframework.web.client.AsyncRestTemplate;
import org.springframework.web.client.ResponseExtractor;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Controller
public class ExecuteMethodExample {
    public static void main(String[] args) {
        AsyncRestTemplate asycTemp = new AsyncRestTemplate();
        String url = "http://google.com";
        HttpMethod method = HttpMethod.GET;
        //create request entity using HttpHeaders
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        AsyncRequestCallback requestCallback = new AsyncRequestCallback() {
            @Override
            public void doWithRequest(AsyncClientHttpRequest arg0)
                    throws IOException {
                System.out.println(arg0.getURI());
            }
        };

        ResponseExtractor<String> responseExtractor = new ResponseExtractor<String>() {
            @Override
            public String extractData(ClientHttpResponse arg0)
                    throws IOException {
                return arg0.getStatusText();
            }
        };
        Map<String, String> urlVariable = new HashMap<String, String>();
        urlVariable.put("q", "Concretepage");
        ListenableFuture<String> future = asycTemp.execute(url, method, requestCallback, responseExtractor, urlVariable);
        try {
            //waits for the result
            String result = future.get();
            System.out.println(result);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }

    public static void main2(String[] args) {
        AsyncRestTemplate asycTemp = new AsyncRestTemplate();
        String url = "http://google.com";
        HttpMethod method = HttpMethod.GET;
        Class<String> responseType = String.class;
        //create request entity using HttpHeaders
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        HttpEntity<String> requestEntity = new HttpEntity<String>("params", headers);
        ListenableFuture<ResponseEntity<String>> future = asycTemp.exchange(url, method, requestEntity, responseType);
        try {
            //waits for the result
            ResponseEntity<String> entity = future.get();
            //prints body source code for the given URL
            System.out.println(entity.getBody());
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }
}