TaeKwonV (Project)
=========================================
My Personal Desktop jar application does some functions

LOG
-----------------------------------------
Start with ZenJava JavaFX Maven plugin Example

Resource
--------------------------------------------------------
Class DateTimeFormatter API (https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html)
The Java™ Tutorials (https://docs.oracle.com/javase/tutorial/datetime/iso/adjusters.html)
Java 8 - New Date/Time API (https://www.tutorialspoint.com/java8/java8_datetime_api.htm)

- [https://docs.oracle.com/javase/8/javafx/api/index.html?javafx/scene/layout/BorderPane.html](https://docs.oracle.com/javase/8/javafx/api/index.html?javafx/scene/layout/BorderPane.html)
- [https://docs.oracle.com/javafx/2/fxml_get_started/why_use_fxml.htm](https://docs.oracle.com/javafx/2/fxml_get_started/why_use_fxml.htm)


#### javaFX native bundle
https://github.com/javafx-maven-plugin/javafx-maven-plugin

#### Plan


#### make executable

https://stackoverflow.com/questions/14566188/maven-executable-jar-with-fxml-files-in-javafx


<plugin>
    <groupId>com.zenjava</groupId>
    <artifactId>javafx-maven-plugin</artifactId>
    <version>8.8.3</version>
    <configuration>
        <mainClass>your.package.with.Launcher</mainClass>
    </configuration>
</plugin>
Than use mvn jfx:jar command to create javafx jar. The jar-file will be placed at target/jfx/app.

If you wish to create a javafx native bundle, use this configuration,

<plugin>
    <groupId>com.zenjava</groupId>
    <artifactId>javafx-maven-plugin</artifactId>
    <version>8.8.3</version>
    <configuration>
        <vendor>YourCompany</vendor>
        <mainClass>your.package.with.Launcher</mainClass>
    </configuration>
</plugin>
and this command: mvn jfx:native. The native launchers or installers will be placed at target/jfx/native.
