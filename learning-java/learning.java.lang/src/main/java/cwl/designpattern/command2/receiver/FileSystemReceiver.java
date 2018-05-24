package cwl.designpattern.command2.receiver;

public interface FileSystemReceiver {

    void openFile();
    void writeFile();
    void closeFile();
}