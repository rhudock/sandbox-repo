package tc.logsee.service;

import org.junit.Test;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class LogAnalysisTest {

    @Test
    public void conversationStartLineTest() throws Exception {

        String regexpStr = "Found no conversation, creating new conversation \\[([-0-9]*)\\] with customer \\[IMessageConnection\\{user=([^,]*), endpoint=([^,]*), gateway_name=(APPLE_BUSINESS_CHAT)\\}\\]: conversationTimeout \\[129600\\], initial SmsChatTemplate\\[smsChatTemplateId=(\\d*), siteId=(\\d*), agentGroupId=(\\d*), businessUnitId=(\\d*), stopKeyword=([^,]*), scriptTreeId=(\\d*), virtualAssistantId=null, smsDeliveryTimeoutSeconds=null\\]";
        Pattern pattern = Pattern.compile(regexpStr);

        String logLine = "Found no conversation, creating new conversation [-4309282124953878381] with customer [IMessageConnection{user=AQAAY2nzJ3iXaDPIWk3J2duxUJKRFguTM4YKbZ7J1c3iBxgS59ccDnj25mFO6l4GDJ2sPBsz9ZecFyvZXO1s5lERHesOzxLAohA7JftLCRgl1Ejb14XFTZFDHuN1v17xxADkcZ2d/bIAfPZoa2eXjIV9gdul9Ng_, endpoint=656c19b3-be94-11e7-847d-7b88b04daa8e||, gateway_name=APPLE_BUSINESS_CHAT}]: conversationTimeout [129600], initial SmsChatTemplate[smsChatTemplateId=33, siteId=10006005, agentGroupId=10006007, businessUnitId=19001105, stopKeyword=no_keyword, scriptTreeId=12201177, virtualAssistantId=null, smsDeliveryTimeoutSeconds=null]";

        Matcher matcher = pattern.matcher(logLine);

        if (logLine.startsWith("Found no conversation, creating new conversation")) {
            System.out.println("Create a Conversation");
        }

        if (matcher.find()) {
            System.out.println("Found");
            System.out.println("Start index: " + matcher.start());
            System.out.println("End index: " + matcher.end() + " ");
            System.out.println("Match:" + matcher.group());
            System.out.println("*** ConversationId:" + matcher.group(1));
            System.out.println("*** Customer Contact Id:" + matcher.group(2));
            System.out.println("*** endpoint:" + matcher.group(3));
            System.out.println("gateway name:" + matcher.group(4));
            System.out.println("Template Id:" + matcher.group(5));
            System.out.println("*** siteId Id:" + matcher.group(6));
            System.out.println("agentGroup Id:" + matcher.group(7));
            System.out.println("businessUnit Id:" + matcher.group(8));
        } else {
            System.out.println("Not found");
        }

        System.out.print("End ---- ");
    }


    @Test
    public void conversationDetectTest() throws Exception {

        String regexpStr = ".*conversation \\[([-0-9]*)\\].*";
        Pattern pattern = Pattern.compile(regexpStr);

        String logLine = "Found no conversation, creating new conversation [-4309282124953878381] with customer [IMessageConnection{user=AQAAY2nzJ3iXaDPIWk3J2duxUJKRFguTM4YKbZ7J1c3iBxgS59ccDnj25mFO6l4GDJ2sPBsz9ZecFyvZXO1s5lERHesOzxLAohA7JftLCRgl1Ejb14XFTZFDHuN1v17xxADkcZ2d/bIAfPZoa2eXjIV9gdul9Ng_, endpoint=656c19b3-be94-11e7-847d-7b88b04daa8e||, gateway_name=APPLE_BUSINESS_CHAT}]: conversationTimeout [129600], initial SmsChatTemplate[smsChatTemplateId=33, siteId=10006005, agentGroupId=10006007, businessUnitId=19001105, stopKeyword=no_keyword, scriptTreeId=12201177, virtualAssistantId=null, smsDeliveryTimeoutSeconds=null]";

        Matcher matcher = pattern.matcher(logLine);

        if (logLine.startsWith("Found no conversation, creating new conversation")) {
            System.out.println("Create a Conversation");
        }

        if (matcher.find()) {
            System.out.println("Found");
            System.out.println("Start index: " + matcher.start());
            System.out.println("End index: " + matcher.end() + " ");
            System.out.println("Match:" + matcher.group());
            System.out.println("*** ConversationId:" + matcher.group(1));
        } else {
            System.out.println("Not found");
        }

        System.out.print("End ---- ");
    }

    @Test
    public void customerDetectTest() throws Exception {

        String regexpStr = ".*IMessageConnection\\{user=([^,]*),.*";
        Pattern pattern = Pattern.compile(regexpStr);

        String logLine = "Found no conversation, creating new conversation [-4309282124953878381] with customer [IMessageConnection{user=AQAAY2nzJ3iXaDPIWk3J2duxUJKRFguTM4YKbZ7J1c3iBxgS59ccDnj25mFO6l4GDJ2sPBsz9ZecFyvZXO1s5lERHesOzxLAohA7JftLCRgl1Ejb14XFTZFDHuN1v17xxADkcZ2d/bIAfPZoa2eXjIV9gdul9Ng_, endpoint=656c19b3-be94-11e7-847d-7b88b04daa8e||, gateway_name=APPLE_BUSINESS_CHAT}]: conversationTimeout [129600], initial SmsChatTemplate[smsChatTemplateId=33, siteId=10006005, agentGroupId=10006007, businessUnitId=19001105, stopKeyword=no_keyword, scriptTreeId=12201177, virtualAssistantId=null, smsDeliveryTimeoutSeconds=null]";

        Matcher matcher = pattern.matcher(logLine);

        if (logLine.startsWith("Found no conversation, creating new conversation")) {
            System.out.println("Create a Conversation");
        }

        if (matcher.find()) {
            System.out.println("Found");
            System.out.println("Start index: " + matcher.start());
            System.out.println("End index: " + matcher.end() + " ");
            System.out.println("Match:" + matcher.group());
            System.out.println("*** Apple user id:" + matcher.group(1));
        } else {
            System.out.println("Not found");
        }

        System.out.print("End ---- ");
    }


}

