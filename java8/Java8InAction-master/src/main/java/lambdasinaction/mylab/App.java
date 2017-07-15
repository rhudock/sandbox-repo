package lambdasinaction.mylab;
/**
 * https://www.youtube.com/watch?v=q5i_O4Uj_O8
 */

interface Executable {
    void execute();
}

interface Executable2 {
    int execute();
}

interface Executable3 {
    int execute(int i);
}

class Runner {
    public void run(Executable ex) {
        System.out.println("Executing code block ...");
        ex.execute();
    }

    public int run2(Executable2 ex) {
        System.out.println("Executing code block ...");
        int result = ex.execute();
        System.out.println("Return value is " + result);
        return 3;
    }

    public int run3(int a, Executable3 ex) {
        System.out.println("Executing code block ...");
        int result = ex.execute(a);
        System.out.println("Return value is " + result);
        return 3;
    }
}

public class App {

    public static void main(String[] args) {
        Runner runner = new Runner();
        runner.run(new Executable() {
            public void execute() {
                System.out.println("Hello there.");
            }
        });
        System.out.println("=====================================");
        runner.run(()->System.out.println("Hello from lamda"));
        lamdaex01();
        lamdaex02();
        lamdaex03();
    }

    public static void lamdaex01() {
        Runner runner = new Runner();
        runner.run(()-> {
            System.out.println("Hello from lamda");
        });
    }

    public static void lamdaex02() {
        Runner runner = new Runner();
        runner.run2(()-> {
            System.out.println("Hello from lamda");
            return 6;
        });
    }

    public static void lamdaex03() {
        Runner runner = new Runner();
        runner.run3(3, new Executable3() {
            public int execute(int a) {
                System.out.println("Hello there.");
                return 7 + a;
            }
        });

        runner.run3(7, a -> {
            System.out.println("Hello from lamda");
            return 6 + a;
        });
    }

}
