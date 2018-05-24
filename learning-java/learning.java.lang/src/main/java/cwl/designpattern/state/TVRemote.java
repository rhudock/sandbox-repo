package cwl.designpattern.state;

import cwl.designpattern.state.state.State;
import cwl.designpattern.state.state.TVContext;
import cwl.designpattern.state.state.TVStartState;
import cwl.designpattern.state.state.TVStopState;

public class TVRemote {

    public static void main(String[] args) {
        TVContext context = new TVContext();
        State tvStartState = new TVStartState();
        State tvStopState = new TVStopState();

        context.setState(tvStartState);
        context.doAction();


        context.setState(tvStopState);
        context.doAction();

    }

}