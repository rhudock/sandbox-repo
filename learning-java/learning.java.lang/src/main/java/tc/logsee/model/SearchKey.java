package tc.logsee.model;

public class SearchKey {

    enum SearchKeyType {
        MUST, OPTIONAL;
    }

    private SearchKeyType searchKeyType;
    private String key;
    private String logFileName;
}
