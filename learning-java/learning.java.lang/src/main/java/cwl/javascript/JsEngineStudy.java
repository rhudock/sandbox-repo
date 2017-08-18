package cwl.javascript;

import javax.script.Bindings;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineFactory;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * http://www.programcreek.com/java-api-examples/index.php?source_dir=xbpm5-master/activiti-engine/src/main/java/org/activiti/engine/impl/scripting/ScriptingEngines.java
 */
public class JsEngineStudy {

    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws ScriptException {
        ScriptEngineManager manager = new ScriptEngineManager();
        List<ScriptEngineFactory> factories = manager.getEngineFactories();
        for (ScriptEngineFactory f : factories) {
            System.out.println("egine name:" + f.getEngineName());
            System.out.println("engine version:" + f.getEngineVersion());
            System.out.println("language name:" + f.getLanguageName());
            System.out.println("language version:" + f.getLanguageVersion());
            System.out.println("names:" + f.getNames());
            System.out.println("mime:" + f.getMimeTypes());
            System.out.println("extension:" + f.getExtensions());
            System.out.println("-----------------------------------------------");
        }

        ScriptEngine engine = manager.getEngineByName("js");
        engine.put("a", 4);
        engine.put("b", 6);
        Object maxNum = engine.eval("function max_num(a,b){return (a>b)?a:b;}");
        System.out.println("max_num:" + maxNum + ", (class = " + maxNum.getClass() + ")");

        @SuppressWarnings("rawtypes")
        Map m = new HashMap();
        m.put("c", 10);
        engine.put("m", m);

        engine.eval("var x= max_num(a,m.get('c'));");
        System.out.println("max_num:" + engine.get("x"));

        try {
            Object evalResult = evaluate(null, "js");
            System.out.println(evalResult.toString());
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    protected static Object evaluate(String script, String language) throws Exception {
        ScriptEngineManager scriptEngineManager = new ScriptEngineManager();
        ScriptEngine scriptEngine = scriptEngineManager.getEngineByName(language);

        if (scriptEngine == null) {
            throw new Exception("Can't find scripting engine for '" + language + "'");
        }
        script = "dfas function max_num(a,b){return (a>b)?a:b;}";

        try {
            return scriptEngine.eval(script);
        } catch (ScriptException e) {
            throw new Exception("problem evaluating script: " + e.getMessage(), e);
        }
    }

    protected static Object evaluate(String script) throws Exception {
        ScriptEngineManager scriptEngineManager = new ScriptEngineManager();
        ScriptEngine scriptEngine = scriptEngineManager.getEngineByName("js");

        if (scriptEngine == null) {
            throw new Exception("Can't find scripting engine for '" + "js" + "'");
        }
        script = "dfas function max_num(a,b){return (a>b)?a:b;}";

        try {
            return scriptEngine.eval(script);
        } catch (ScriptException e) {
            throw new Exception("problem evaluating script: " + e.getMessage(), e);
        }
    }

}
