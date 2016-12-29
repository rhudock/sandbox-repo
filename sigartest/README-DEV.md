


## To Run
```

```



## Ref
Sigar source: https://github.com/hyperic/sigar
Sigar home: https://support.hyperic.com/display/SIGAR/Home
Examples:
http://www.javased.com/index.php?api=org.hyperic.sigar.Sigar
FileSystem Usage Example: http://www.programcreek.com/java-api-examples/index.php?api=org.hyperic.sigar.FileSystemUsage

Change Java Version
sudo update-alternatives --config java

## Maven Standalone jar build
------------------------------------------------------------------------------------------------------------------------
I am trying to build a jar file that contains all dependencies with it.
But not working so far.

Maven - building jar with all libraries.
adding dependency: http://stackoverflow.com/questions/1729054/including-dependencies-in-a-jar-with-maven

sigar maven; http://stackoverflow.com/questions/27065270/how-to-configur-sigar-with-libsigar-x86-linux-so-automatically-in-maven-project


How do I build a jar file that contains its dependencies?:
http://www.avajava.com/tutorials/lessons/how-do-i-build-a-jar-file-that-contains-its-dependencies.html?page=1


### Using java.library.path
java -Djava.library.path=C:\code\Sandbox\sandbox-repo\sigartest\lib -jar target/standalone-Sigartest.jar
java -Djava.library.path=lib -jar target/standalone-Sigartest.jar
System.setProperty(“java.library.path”, “/path/to/library”);
------------------------------------------------------------------------------------------------------------------------
