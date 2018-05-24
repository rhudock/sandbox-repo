package cwl.designpattern.command2;

import cwl.designpattern.command2.receiver.FileSystemReceiver;
import cwl.designpattern.command2.receiver.UnixFileSystemReceiver;
import cwl.designpattern.command2.receiver.WindowsFileSystemReceiver;

public class FileSystemReceiverUtil {

    public static FileSystemReceiver getUnderlyingFileSystem(){
        String osName = System.getProperty("os.name");
        System.out.println("Underlying OS is:"+osName);
        if(osName.contains("Windows")){
            return new WindowsFileSystemReceiver();
        }else{
            return new UnixFileSystemReceiver();
        }
    }

}