package cwl.unittest.mockito.annotation;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

/*
http://www.baeldung.com/mockito-annotations
 */
@RunWith(MockitoJUnitRunner.class)
public class InjectMocksAnnotation {

    @Mock
    Map<String, String> wordMap;

    /*
    Now – let’s discuss how to use @InjectMocks annotation – to inject mock fields into the tested object automatically.
    In the following example – we use @InjectMocks to inject the mock wordMap into the MyDictionary dic:
     */
    @InjectMocks
    MyDictionary dic = new MyDictionary();

    @Test
    public void whenUseInjectMocksAnnotation_thenCorrect() {
        Mockito.when(wordMap.get("aWord")).thenReturn("aMeaning");

        assertEquals("aMeaning", dic.getMeaning("aWord"));
    }

    public class MyDictionary {
        Map<String, String> wordMap;

        public MyDictionary() {
            wordMap = new HashMap<String, String>();
        }
        public void add(final String word, final String meaning) {
            wordMap.put(word, meaning);
        }
        public String getMeaning(final String word) {
            return wordMap.get(word);
        }
    }
}
