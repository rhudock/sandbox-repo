package spring.async;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.util.concurrent.ListenableFutureCallback;
import org.springframework.web.client.AsyncRestTemplate;

import java.util.concurrent.ExecutionException;

import static org.springframework.http.HttpStatus.OK;

/*
https://www.concretepage.com/spring-4/spring-4-asyncresttemplate-listenablefuture-example
 */
public class ExchangeMethodCallBackExample {
    private static final Logger logger = LoggerFactory.getLogger(ExchangeMethodCallBackExample.class);

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

        class FutureCallback implements ListenableFutureCallback<ResponseEntity<String>> {
            @Override
            public void onSuccess(ResponseEntity<String> content) {
                if (content.getStatusCode() == OK) {
                                                //prints body source code for the given URL
                       System.out.println(content.getBody());
                } else {

                }
            }

            @Override
            public void onFailure(Throwable throwable) {
                logger.error("Failed", throwable);

            }
        }
        future.addCallback(new FutureCallback());



    }
}