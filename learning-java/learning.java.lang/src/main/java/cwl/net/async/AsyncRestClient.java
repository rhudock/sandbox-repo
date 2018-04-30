package cwl.net.async;

import cwl.net.async.response.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.util.concurrent.ListenableFutureCallback;
import org.springframework.web.client.AsyncRestOperations;

import java.util.concurrent.ExecutionException;

/**
 * A simple REST client using asynchronous Spring rest template
 * http://docs.spring.io/spring/docs/current/spring-framework-reference/html/remoting.html#rest-async-resttemplate
 * <p/>
 * This allows non blocking calls by the REST client
 * (perhaps performance improvement may be more obvious for REST web service rather than REST client)
 */
@Component
public class AsyncRestClient {

    private static final Logger LOG = LoggerFactory.getLogger(AsyncRestClient.class);

    @Value("${service.full.url}")
    private String apiUrl;

    private final AsyncRestOperations asyncRestTemplate;

    @Autowired
    public AsyncRestClient(AsyncRestOperations asyncRestTemplate) {
        this.asyncRestTemplate = asyncRestTemplate;
    }

    public ListenableFuture<ResponseEntity<String>> getDataStringAsync() {

        LOG.info("Retrieving data from service asynchronously...");

        //Parsing the response as String
        //Returns a listenable future wrapper that wrap the concrete results
        ListenableFuture<ResponseEntity<String>> responseStringFuture = asyncRestTemplate.getForEntity(apiUrl, String.class);

        // Add completion callbacks
        responseStringFuture.addCallback(new ListenableFutureCallback<ResponseEntity<String>>() {
            @Override
            public void onSuccess(ResponseEntity<String> entity) {
                LOG.info("[Success] Response string:" + entity);
            }

            @Override
            public void onFailure(Throwable t) {
                LOG.error("[Failed] Getting string response:" + t);

            }
        });

        return responseStringFuture;

    }


    public ListenableFuture<ResponseEntity<Response>> getDataJsonAsync() {

        LOG.info("Retrieving data from service asynchronously...");
        ListenableFuture<ResponseEntity<Response>> responseObjectFuture = null;
        try {
            //Use JSON converter to parse the response
            responseObjectFuture = asyncRestTemplate.getForEntity(apiUrl, Response.class);

            // Add completion callbacks
            responseObjectFuture.addCallback(new ListenableFutureCallback<ResponseEntity<Response>>() {
                @Override
                public void onSuccess(ResponseEntity<Response> entity) {
                    LOG.info("[Success] Response json:" + entity);
                }

                @Override
                public void onFailure(Throwable t) {
                    LOG.error("[Failed] Getting json response:" + t);
                }
            });

            //Alternatively, you can force synchronous fetching of results from listenableFuture
            ResponseEntity<Response> responseObject = responseObjectFuture.get();
            LOG.info("[Force sync] JSON response object :" + responseObject);


        } catch (InterruptedException ex) {
            LOG.error("Error: {}", ex);
        } catch (ExecutionException ex) {
            LOG.error("Error: {}", ex);
        }

        return responseObjectFuture;
    }


    public String getApiUrl() {
        return apiUrl;
    }

    public void setApiUrl(String apiUrl) {
        this.apiUrl = apiUrl;
    }
}