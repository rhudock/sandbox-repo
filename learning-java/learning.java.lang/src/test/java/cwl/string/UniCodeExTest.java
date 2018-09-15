package cwl.string;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class UniCodeExTest {
    @Before
    public void setUp() throws Exception {
    }

    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void test_UniCode() {
        assertThat(Character.UnicodeBlock.of('a') == Character.UnicodeBlock.BASIC_LATIN).isTrue(); //true
        assertThat(Character.UnicodeBlock.of('�') == Character.UnicodeBlock.BASIC_LATIN).isFalse(); //false
    }
}