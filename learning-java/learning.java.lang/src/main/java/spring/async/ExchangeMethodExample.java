package spring.async;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.web.client.AsyncRestTemplate;

import java.util.concurrent.ExecutionException;

/*
https://www.concretepage.com/spring-4/spring-4-asyncresttemplate-listenablefuture-example
 */
public class ExchangeMethodExample {

    private  static  String url = "http://google.com";
    private  static  HttpMethod method = HttpMethod.GET;
    private  static  Class<String> responseType = String.class;

    public static void main(String[] args) {

        AsyncRestTemplate asycTemp = new AsyncRestTemplate();

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