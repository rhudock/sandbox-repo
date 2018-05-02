package cwl.net.springrestclient;

import cwl.net.springrestclient.dto.Foo;
import cwl.net.springrestclient.dto.MyString;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.AsyncClientHttpRequest;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.web.client.AsyncRequestCallback;
import org.springframework.web.client.AsyncRestTemplate;
import org.springframework.web.client.ResponseExtractor;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public class RestClientFooResponse {

    public static void main(String[] args) {
        getFoo();
    }

    public static void getFoo() {
        AsyncRestTemplate asycTemp = new AsyncRestTemplate();
        String url = "http://localhost:8082/spring-rest/foos/1";
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

        HttpEntity<String> requestEntity = new HttpEntity<String>(null, headers);

        ResponseExtractor<String> responseExtractor = new ResponseExtractor<String>() {
            @Override
            public String extractData(ClientHttpResponse arg0)
                    throws IOException {
                return arg0.getStatusText();
            }
        };

        Map<String, String> urlVariable = new HashMap<String, String>();
      //  urlVariable.put("q", "Concretepage");

        ListenableFuture<ResponseEntity<MyString>> future = asycTemp.exchange(url, HttpMethod.GET, requestEntity, MyString.class, urlVariable);
        try {
            //waits for the result
            ResponseEntity<MyString> result = future.get();
            System.out.println(result);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }

    public static void getFooWithJsonConverter() {
        AsyncRestTemplate asycTemp = new AsyncRestTemplate();
        String url = "http://localhost:8082/spring-rest/foos/1";
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

        HttpEntity<String> requestEntity = new HttpEntity<String>(null, headers);
        ResponseExtractor<String> responseExtractor = new ResponseExtractor<String>() {
            @Override
            public String extractData(ClientHttpResponse arg0)
                    throws IOException {
                return arg0.getStatusText();
            }
        };

        Map<String, String> urlVariable = new HashMap<String, String>();
      //  urlVariable.put("q", "Concretepage");

        ListenableFuture<ResponseEntity<Foo>> future = asycTemp.exchange(url, HttpMethod.GET, requestEntity, Foo.class, urlVariable);
        try {
            //waits for the result
            ResponseEntity<Foo> result = future.get();
            System.out.println(result);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }

    public static void getFooAsString() {
        AsyncRestTemplate asycTemp = new AsyncRestTemplate();
        String url = "http://localhost:8082/spring-rest/foos/1";
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

        HttpEntity<String> requestEntity = new HttpEntity<String>(null, headers);
        ResponseExtractor<String> responseExtractor = new ResponseExtractor<String>() {
            @Override
            public String extractData(ClientHttpResponse arg0)
                    throws IOException {
                return arg0.getStatusText();
            }
        };

        Map<String, String> urlVariable = new HashMap<String, String>();
      //  urlVariable.put("q", "Concretepage");

        ListenableFuture<ResponseEntity<String>> future = asycTemp.exchange(url, HttpMethod.GET, requestEntity, String.class, urlVariable);
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
