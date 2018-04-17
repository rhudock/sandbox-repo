package tc.logsee.model;

import java.util.LinkedList;
import java.util.List;

public class LogInfo {
    List<String> logInfoTypes = new LinkedList<>();

    List<LogInfoRegExpRule> logInfoRegExpRules = new LinkedList<>();

    public List<String> getLogInfoTypes() {
        return logInfoTypes;
    }

    public void setLogInfoTypes(List<String> logInfoTypes) {
        this.logInfoTypes = logInfoTypes;
    }

    public List<LogInfoRegExpRule> getLogInfoRegExpRules() {
        return logInfoRegExpRules;
    }

    public void setLogInfoRegExpRules(List<LogInfoRegExpRule> logInfoRegExpRules) {
        this.logInfoRegExpRules = logInfoRegExpRules;
    }

    static class LogInfoRegExpRule {
        String logInfoType;
        String regExp;
        String classApply;

        public String getLogInfoType() {
            return logInfoType;
        }

        public void setLogInfoType(String logInfoType) {
            this.logInfoType = logInfoType;
        }

        public String getRegExp() {
            return regExp;
        }

        public void setRegExp(String regExp) {
            this.regExp = regExp;
        }

        public String getClassApply() {
            return classApply;
        }

        public void setClassApply(String classApply) {
            this.classApply = classApply;
        }
    }
}
