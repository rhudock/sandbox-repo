package cwl.designpattern.command2;

import cwl.designpattern.command2.command.Command;

public class FileInvoker {

    public Command command;

    public FileInvoker(Command c){
        this.command=c;
    }

    public void execute(){
        this.command.execute();
    }
}