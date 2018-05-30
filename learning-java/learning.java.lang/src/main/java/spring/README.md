

### Test
http://www.baeldung.com/mockito-annotations
* [Spring 4.3.x Document](https://docs.spring.io/spring/docs/4.3.x/spring-framework-reference/html/integration-testing.html#spring-mvc-test-server-static-imports)
* [Spring framework project](https://github.com/spring-projects/spring-framework)

### Mockito
* Difference between two.
```
@RunWith(MockitoJUnitRunner.class)
public class MockitoAnnotationTest {
    ...
}
```
```
@Before
public void init() {
    MockitoAnnotations.initMocks(this);
}
```