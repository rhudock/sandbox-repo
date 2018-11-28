/*
    Tc Framework Structure.
 */
javascript: function spacer(numberOfSpaces) {
    var strSpaces = "";
    for (i = 0; i < numberOfSpaces; i++) strSpaces += " ";
    return strSpaces;
}
if (typeof inqFrame != "undefined") {
    if (typeof inqFrame.Inq.CHM.getChat() != "undefined" && inqFrame.Inq.CHM.getChat() != null) {
        var chatData = inqFrame.Inq.CHM.chat.cd;
        var ruleData = inqFrame.Inq.CHM.chat.rule;
        var chatSpec = inqFrame.Inq.CHM.chat.chatSpec;
        var chatTheme = inqFrame.Inq.CHM.chat.chatSpec.chatTheme;
        var lastChat = inqFrame.Inq.CHM.lastChat;
        alert("CURRENT CHAT INFO:\n---------------------------\n\n"
            + "RT Version:" + spacer(4) + (typeof lastChat.businessUnitID != "undefined" ? "RTV3" : "RTV2") + "\n\n"
            + "Channel ID:" + spacer(5) + (typeof lastChat.businessUnitID != "undefined" ? lastChat.businessUnitID : lastChat.channelID) + "\n"
            + "Chat Type:" + spacer(6) + chatData.chatType + "\n"
            + "Chat ID:" + spacer(11) + chatData.id + "\n"
            + "Agent ID:" + spacer(9) + (typeof chatData.aid != "undefined" ? chatData.aid : "Not connected to agent") + "\n\n"
            + "Rule Name:" + spacer(5) + ruleData.name + "\n"
            + "Rule ID:" + spacer(11) + ruleData.id + "\n"
            + "Funnel Level:" + spacer(2) + ruleData.funnelLevel + "\n"
            + "Q-Threshold:" + spacer(2) + (ruleData.qt == "-1" ? "Default (1.0)" : ruleData.qt) + "\n\n"
            + "Chat Spec ID:" + spacer(1) + chatSpec.id + "\n"
            + "Opener:" + spacer(10) + chatSpec.oId + "\n"
            + "Script Tree:" + spacer(4) + chatSpec.stId + "\n\n"
            + "Theme ID:" + spacer(7) + chatTheme.id + "\n"
            + "Theme Name:" + spacer(1) + chatTheme.name + "\n"
            + "Skin MXML:" + spacer(4) + chatTheme.fn + "\n"
            + "Skin Zip:" + spacer(9) + chatTheme.csiz);
    } else if (typeof inqFrame.Inq.CHM.getLastChat() != "undefined" && typeof inqFrame.Inq.CHM.getLastChat().id != "undefined") {
        var lastChatData = inqFrame.Inq.CHM.getLastChat();
        var lastRuleData = inqFrame.Inq.BRM.getRuleById(lastChatData.brID);
        alert("PREVIOUS CHAT INFO:\n---------------------------\n\n"
            + "Timestamp:" + spacer(5) + lastChatData.timestamp + "\n"
            + "RT Version:" + spacer(4) + (typeof lastChatData.businessUnitID != "undefined" ? "RTV3" : "RTV2") + "\n\n"
            + "Channel ID:" + spacer(5) + (typeof lastChatData.businessUnitID != "undefined" ? lastChatData.businessUnitID : lastChatData.channelID) + "\n"
            + "Chat Type:" + spacer(6) + lastChatData.chatType + "\n"
            + "Chat ID:" + spacer(11) + lastChatData.id + "\n\n"
            + "Rule Name:" + spacer(5) + lastRuleData.name + "\n"
            + "Rule ID:" + spacer(11) + lastRuleData.id + "\n"
            + "Funnel Level:" + spacer(2) + lastRuleData.funnelLevel + "\n"
            + "Q-Threshold:" + spacer(2) + (lastRuleData.qt == "-1" ? "Default (1.0)" : lastRuleData.qt));
    }
}