package spring.rest.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestOperations;
import spring.rest.client.response.Response;


/**
 * A simple REST client using synchronous Spring rest template
 * This sample assume the REST service returns JSON payload
 */
@Component
public class SyncRestClient {

  private static final Logger LOG = LoggerFactory.getLogger(SyncRestClient.class);

  @Value("${service.full.url}")
  private String apiUrl;

  private final RestOperations restTemplate;

  @Autowired
  public SyncRestClient(RestOperations restTemplate) {
    this.restTemplate = restTemplate;
  }

  public Response getJsonDataSync() {
    LOG.info("Retrieving data from service synchronously...");


    Response responseObject = restTemplate.getForObject(apiUrl, Response.class);
    LOG.info("JSON response object : {}",  responseObject);

    return responseObject;
  }

  public String getStringDataSync() {
    LOG.info("Retrieving data from service synchronously...");

    String responseString = restTemplate.getForObject(apiUrl, String.class);
    LOG.info("Response string: {}" , responseString);


    return responseString;
  }


  public String getApiUrl() {
    return apiUrl;
  }

  public void setApiUrl(String apiUrl) {
    this.apiUrl = apiUrl;
  }
}
