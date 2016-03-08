package {
    import com.gskinner.spelling.SpellingDictionary;

import mx.core.UIComponent;
	import mx.controls.TextInput;
	import mx.controls.Label;
	import mx.core.Container;
	import mx.utils.StringUtil;
	import flash.events.FocusEvent;
	import mx.containers.HBox;
	import com.gskinner.spelling.SPLTagFlex;

	public class ScriptLineUtils {
		//RegExp to find {{** **}} as result[0] and what was inside as result[1]
		private static const INPUT_REGEXP:String = "\\{\\{\\*\\*(.*?)\\*\\*}\\}";
		private static const INPUT_REGEXP_FLAGS:String = "gmx";
		private static const INPUT_PARAM_SEPARATOR:String = "||";
		private static const INPUT_DEFAULT_WIDTH:int = 50;
		private static const INPUT_CHAR_WIDTH:int = 8;
        private static const INPUT_BORDER_WIDTH:int = 4;
        private static const INPUT_CURSOR_WIDTH:int = 1;
        private static const INPUT_PADDING_WIDTH:int = INPUT_BORDER_WIDTH * 2 + INPUT_CURSOR_WIDTH;
        private static const INPUT_OFFSET:int = 1;
        private static const MAX_LINE_LENGTH:int = 80;

		/**
		 * This function add child components to scriptContainer from parsing scriptLine.
		 * During parsing we are looking for {{**INPUT_NAME||INPUT_LENGTH**}} by RegExp above.
		 * For text which should be inserted we add TextInput,
		 * for non editable text we add Label.
		 *
		 * @param	scriptLine String with some "substitute flags"
		 * @param	scriptContainer Container (f.e. ScriptLineEditor) in which we add components
		 */
		public static function renderScript(scriptLine:String, scriptContainer:Container, useSpellChecker:Boolean = false, spellingDictionary:SpellingDictionary = null):void {
			var pattern:RegExp = new RegExp(INPUT_REGEXP, INPUT_REGEXP_FLAGS);
			var result:Object = pattern.exec(scriptLine);
			var startPosition:int;
			var endPosition:int;
			scriptContainer.removeAllChildren();
            var hBox:HBox = new HBox();
            hBox.setStyle("styleName", "scriptLineBox");
            scriptContainer.addChild(hBox);
            var activeLength:int = 0;
			while (result != null || startPosition < scriptLine.length) {
				endPosition = result != null ? result.index : scriptLine.length;

                // Check that current line smaller then
                if (activeLength > MAX_LINE_LENGTH) {
                    hBox = new HBox();
                    hBox.setStyle("styleName", "scriptLineBox");
                    scriptContainer.addChild(hBox);
                    activeLength = 0;
                }
				//adding Label and TextInput
                var textElement: String = scriptLine.slice(startPosition, endPosition);
                if (textElement.length + activeLength > MAX_LINE_LENGTH) {
                    var startSubIndex: int = 0;
                    var currSubIndex: int = 0;
                    var prevSubIndex: int;
                    do {
                        do {
                            prevSubIndex = currSubIndex;
                            currSubIndex = textElement.indexOf(" ", currSubIndex + 1);
                        } while ((currSubIndex != -1) && (currSubIndex - startSubIndex + activeLength < MAX_LINE_LENGTH));
                        // if this is first word (means it's bigger than MAX_LINE_LENGTH) insert it anyway. we can not wrap it.
                        if (currSubIndex == -1) {
                        	prevSubIndex = textElement.length;
                        	currSubIndex = textElement.length;
                            if (activeLength != 0) {
                                hBox = new HBox();
                                hBox.setStyle("styleName", "scriptLineBox");
                                scriptContainer.addChild(hBox);
                                activeLength = 0;
                            }
                        } else if (prevSubIndex <= startSubIndex) {
                            prevSubIndex = currSubIndex;
                            if (activeLength != 0) {
                                hBox = new HBox();
                                hBox.setStyle("styleName", "scriptLineBox");
                                scriptContainer.addChild(hBox);
                                activeLength = 0;
                            }
                        }
                        hBox.addChild(createLabelComponent(textElement.slice(startSubIndex, prevSubIndex)));
                        activeLength += prevSubIndex - startSubIndex;
                        startSubIndex = prevSubIndex;
                        if (currSubIndex - startSubIndex + 1 + activeLength >= MAX_LINE_LENGTH) {
                            hBox = new HBox();
                            hBox.setStyle("styleName", "scriptLineBox");
                            scriptContainer.addChild(hBox);
                            activeLength = 0;
                        }
                        currSubIndex = prevSubIndex;
                    } while (currSubIndex < textElement.length);
                } else {
                    if (textElement.length > 0) {
                        hBox.addChild(createLabelComponent(textElement));
                        activeLength += textElement.length;
                    }
                }

				if (result != null) {
	                var textInput: TextInput = createInputComponent(result[1]);
	                var textInputCharLength: int = (textInput.width - INPUT_PADDING_WIDTH ) / INPUT_CHAR_WIDTH;
	                if (textInputCharLength + activeLength > MAX_LINE_LENGTH) {
	                    hBox = new HBox();
                        hBox.setStyle("styleName", "scriptLineBox");
	                    scriptContainer.addChild(hBox);
	                    activeLength = 0;
	                }
	                activeLength += textInputCharLength + INPUT_OFFSET;
	                hBox.addChild(textInput);
					if (useSpellChecker) {
						hBox.addChild(createSpellChecker(textInput, spellingDictionary));
					}
					startPosition = endPosition + result[0].length;
					result = pattern.exec(scriptLine);
				} else {
					startPosition = endPosition + 1;					
				}
			}
		}

		/**
		 * This function create HBox componet and add children into it.
		 * 
		 * @param	children Array with UIComponent (f.e. TextInput or Label)
		 * @return HBox with childrens inside
		 * @see renderScript
		 */
		public static function createHBoxComponent(children:Array):HBox {
			var hBox:HBox = new HBox();
			for each (var child:Object in children) {
				hBox.addChild(UIComponent(child));
			}
			return hBox;
		}

		/**
		 * This function creates SPLTagFlex componet and sets TextInput as its target.
		 * 
		 * @param	inputElement TextInput in which we enable spell cheking 
		 * @return SPLTagFlex which should be added to stage in order to start functioning
		 * @see renderScript
		 */
		public static function createSpellChecker(inputElement:TextInput, spellingDictionary:SpellingDictionary):SPLTagFlex {
			var spellChecker:SPLTagFlex = new SPLTagFlex();
			spellChecker.target = inputElement;
			spellChecker.spellingHighlighter.autoUpdate = true;
			spellChecker.spellingHighlighter.customDictionaryEditsEnabled = false;
            spellChecker.spellingHighlighter.spellingDictionary = spellingDictionary;
			//spellChecker.spellingHighlighter.update();
			return spellChecker;
		}

		/**
		 * This function checks if we have one or more "substitute flag"
		 *
		 * @param	scriptLine which we want to check after clicking on it
		 * @return Boolean true if we have "substitute flags"
		 */
		public static function isInputInScript(scriptLine:String):Boolean {
			var pattern:RegExp = new RegExp(INPUT_REGEXP, INPUT_REGEXP_FLAGS);
			return pattern.test(scriptLine);
		}

		/**
		 * This function create TextInput and set its properties
		 *
		 * @param	text String which will be in TextInput and its width after "||
		 * @return TextInput with set: text, errorColor and width
		 * @see renderScript
		 */
		public static function createInputComponent(text:String):TextInput {
			var inputComponent:TextInput = new TextInput();
			var params:Array = text.split(INPUT_PARAM_SEPARATOR);
			var helpText:String = StringUtil.trim(params[0]);
			if (helpText.length > 0){
				inputComponent.text = params[0];
				inputComponent.toolTip = params[0];
				inputComponent.addEventListener(FocusEvent.FOCUS_IN, clearOnFocus);
			}
			inputComponent.setStyle("errorColor", 0xFF0000);
			inputComponent.setStyle("styleName", "monochromeInput");
			if (params.length > 1 && int(params[1]) > 0) {
				var maxLength:int = int(params[1]);
				inputComponent.width = maxLength * INPUT_CHAR_WIDTH + INPUT_PADDING_WIDTH;
				inputComponent.maxChars = maxLength;
			} else {
				inputComponent.width = INPUT_DEFAULT_WIDTH;
			}
			return inputComponent;
		}

		/**
		 * This function clears text in input on first focusing
		 *
		 * @param	event FocusEvent
		 * @see createInputComponent
		 */
		public static function clearOnFocus(event:FocusEvent):void {
			var inputComponent:TextInput = TextInput(event.currentTarget);
			if (inputComponent != null) {
				inputComponent.text = "";
				inputComponent.removeEventListener(FocusEvent.FOCUS_IN, clearOnFocus);
			}
		}

		/**This function create Label component ant set its text.
		 *
		 *
		 * @param	text String for Label
		 * @return Label with text
		 * @see renderScript
		 */
		public static function createLabelComponent(text:String, y:int = 0):Label {
			var labelComponent:Label = new Label();
			labelComponent.text = text;
            labelComponent.setStyle("styleName", "monochromeLabel");
			return labelComponent;
		}

		/**
		 * This function checks if all TextInput fields was filled or replaced with not empty valiues.
		 *
		 * @param	scriptContainer Container which have TextInput children
		 * @return Boolean true when all fields have inserted values
		 */
		public static function validateScriptInputs(scriptContainer:Container):Boolean {
			var resultValid:Boolean = true;
			for each (var component:Object in scriptContainer.getChildren()) {
				if (component is Container) {
					var subResultValid:Boolean = validateScriptInputs(Container(component));
					resultValid &&= subResultValid;
				} else if (component is TextInput) {
					var inputComponent:TextInput = TextInput(component);
					// toolTip has Info text which was shown as text value too.
					if (StringUtil.trim(inputComponent.text).length == 0 || inputComponent.toolTip == inputComponent.text){
						resultValid = false;
						inputComponent.errorString = L10.n.getString('please.fill');
					} else {
						inputComponent.errorString = "";
					}
				}
			}
			return resultValid;
		}

		/**
		 * This function generate scriptLine from non edited and filled text.
		 *
		 * @param	scriptContainer Container which have children (f.e. TextInputs and/or Labels)
		 * @return String rendered from text of TextInput and Label components
		 */
		public static function generateScript(scriptContainer:Container):String {
			var result:String = "";
			for each (var component:Object in scriptContainer.getChildren()) {
				if (component is Container) {
					result += generateScript(Container(component));
				} else if (!(component is SPLTagFlex)) {
					result += component.text;
				}
			}
			return result;
		}
	}
}