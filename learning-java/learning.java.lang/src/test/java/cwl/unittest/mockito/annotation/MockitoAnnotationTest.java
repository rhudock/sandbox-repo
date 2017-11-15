package cwl.unittest.mockito.annotation;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class MockitoAnnotationTest {

    // https://stackoverflow.com/questions/39452438/mockito-how-to-verify-a-method-was-called-only-once-with-exact-parameters-ignor
    interface Foo {
        void add(String str);

        void clear();
    }


    @Test
    public void testAddWasCalledOnceWith1IgnoringAllOtherInvocations() throws Exception {
        // given
        Foo foo = Mockito.mock(Foo.class);

        // when
        foo.add("1"); // call to verify
        foo.add("2"); // !!! don't allow any other calls to add()
        foo.clear();  // calls to other methods should be ignored

        // then
        Mockito.verify(foo, Mockito.times(1)).add("1");
        // TODO: don't allow all other invocations with add()
        //       but ignore all other calls (i.e. the call to clear())
        Mockito.verify(foo, Mockito.times(1)).add("1");
        Mockito.verify(foo, Mockito.times(1)).add(Mockito.anyString());

        Mockito.verify(foo).add("1");
        Mockito.verify(foo).add(Mockito.anyString());
    }

    // end - https://stackoverflow.com/questions/39452438/mockito-how-to-verify-a-method-was-called-only-once-with-exact-parameters-ignor
}
