function OptionList() {
   this.optionArray = [];

   this.getOptionText = function(optionValue) {
      var text = null;

      for (option in this.optionArray) {
         if (this.optionArray[option].value == optionValue) {
            text = this.optionArray[option].text;
            break;
         }
      }

      return text;
   }

   this.getSelectElement = function(selectedValue) {
      var selectElement = $(document.createElement("select"));

      for (option in this.optionArray) {
         var value = this.optionArray[option].value;
         var text = this.optionArray[option].text;

         var optionElement = $(document.createElement("option")).attr("value", value).text(text);

         if (value == selectedValue) {
            optionElement.attr("selected", "selected");
         }

         selectElement.append(optionElement);
      }

      selectElement.addClass("ui-corner-all");

      return selectElement;
   }

   this.getOptionObject = function(optionValue) {
      var obj = null;

      for (option in this.optionArray) {
         if (this.optionArray[option].value == optionValue) {
            obj = this.optionArray[option];
            break;
         }
      }

      return obj;
   }
}