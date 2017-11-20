package lambdasinaction.mylab.future;

import org.junit.Test;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static lambdasinaction.chap11.Util.delay;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.*;

/**
 * Created by dlee on 7/22/17.
 */
public class CompletableFutureExTest {

    @Test
    public void test_completed_future() throws Exception {
        String expectedValue = "the expected value";
        CompletableFuture<String> alreadyCompleted = CompletableFuture.completedFuture(expectedValue);
        assertThat(alreadyCompleted.get(), is(expectedValue));
    }

    /*
    http://codingjunkie.net/completable-futures-part1/
     */
    private static ExecutorService service = Executors.newCachedThreadPool();

    private static Supplier<String> simulatedTask(int delay, String str){
        return () -> {
            System.out.println("inside simulatedTask");
            delay(delay);
            return str;
        };
    }

    @Test
    public void test_run_async() throws Exception {
        CompletableFuture<Void> runAsync = CompletableFuture.runAsync(() -> System.out.println("running async task"), service);
        //utility testing method
        delay(1);
        assertThat(runAsync.isDone(), is(true));
    }

    @Test
    public void test_supply_async() throws Exception {
        CompletableFuture<String> completableFuture = CompletableFuture.supplyAsync(simulatedTask(1, "Final Result"), service);
        assertThat(completableFuture.get(), is("Final Result"));
    }

    /*
Now that we can create CompletableFuture objects to run asynchronous tasks,
let’s learn how to ‘listen’ when a task completes to perform follow up action(s).
It’s important to mention here that when adding follow on CompletionStage objects,
   the previous task needs to complete successfully in order for the follow on task/stage to run.
There are methods to deal with failed tasks, but handling errors in the CompletableFuture chain are covered in a follow up post.
     */
    @Test
    public void test_then_run_async() throws Exception {
        Map<String,String> cache = new HashMap<>();
        cache.put("key","value");
        CompletableFuture<String> taskUsingCache = CompletableFuture.supplyAsync(simulatedTask(10000,cache.get("key")),service);
        System.out.println("inside test_then_run_async 0");
        CompletableFuture<Void> cleanUp = taskUsingCache.thenRunAsync(cache::clear,service);
        System.out.println("inside test_then_run_async 1");
        cleanUp.get();
        String theValue = taskUsingCache.get();
        System.out.println("inside test_then_run_async 2");
        assertThat(cache.isEmpty(),is(true));
        assertThat(theValue,is("value"));
    }
/* -- Result  - ?
inside simulatedTask
inside test_then_run_async 0
inside test_then_run_async 1
inside test_then_run_async 2
 */




    @Test
    public void test_accept_result() throws Exception {
        Set<String> results = new HashSet<>();

        CompletableFuture<String> task = CompletableFuture.supplyAsync(simulatedTask(1000, "add when done"), service);
        System.out.println("main test_then_run_async 10");
        CompletableFuture<Void> acceptingTask = task.thenAccept(results::add);
        System.out.println("main test_then_run_async 20");
        delay(2);
        System.out.println("main test_then_run_async 30");
        assertThat(acceptingTask.isDone(), is(true));
        assertThat(results.size(), is(1));
        assertThat(results.contains("add when done"), is(true));
    }
/*
inside simulatedTask
inside test_then_run_async 10
inside test_then_run_async 20
inside test_then_run_async 30
 */


/*
Why this fails?
 */
    @Test
    public void test_accept_result_my() throws Exception {
        Set<String> results = new HashSet<>();

        CompletableFuture<String> task = CompletableFuture.supplyAsync(() -> {
            System.out.println("inside simulatedTask");
            delay(1000);
            return "add When it is done"; } , service);
        System.out.println("main test_then_run_async 10");

        CompletableFuture<Void> acceptingTask = task.thenAccept(str -> {
            System.out.println("inside acceptingTask");
            results.add(str);
            return;
        });
        System.out.println("main test_then_run_async 20");
        acceptingTask.thenAccept(test -> {
            System.out.println("inside acceptingTask.thenAccept");
            assertThat(acceptingTask.isDone(), is(true));
            assertThat(results.size(), is(1));
            assertThat(results.contains("add when done"), is(true));
        });
        System.out.println("main test_then_run_async 30");
delay(3000);
    }



    @Test
    public void test_then_compose() throws Exception {

        Function<Integer,Supplier<List<Integer>>> getFirstTenMultiples = num ->
                ()-> {
                    System.out.println("inside getFirstTenMultiples");
                    delay(1000);
                    return Stream.iterate(num, i -> i + num).limit(10).collect(Collectors.toList());
                };

        Supplier<List<Integer>> multiplesSupplier = getFirstTenMultiples.apply(13);

        //Original CompletionStage
        CompletableFuture<List<Integer>> getMultiples = CompletableFuture.supplyAsync(multiplesSupplier, service);
        System.out.println("inside test_then_run_async 10");

        //Function that takes input from orignal CompletionStage
        Function<List<Integer>, CompletableFuture<Integer>> sumNumbers = multiples -> {
            System.out.println("inside sumNumbers");
            delay(2000);
            return CompletableFuture.supplyAsync(() -> multiples.stream().mapToInt(Integer::intValue).sum());
        };

        System.out.println("inside test_then_run_async 20");

        //The final CompletableFuture composed of previous two.
        CompletableFuture<Integer> summedMultiples = getMultiples.thenComposeAsync(sumNumbers, service);

        assertThat(summedMultiples.get(), is(715));
    }
}