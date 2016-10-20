/**
 * $Id$
 *
 * jquery.dcmi.js
 * Developer Daniel Chealwoo Lee
 *
 * Copyright (c) Nomadix 2009, All rights reserved.
 *
 * A HTML Web Page designer used ibis.
 *
 * Requirements:
 * jquery 1.3.2
 */

(function($) {

   jQuery.dcmi = function () {
   };

   $.dcmi.ajaxApi = {
      ajaxApiSave: function (option) {

         // default option
         var op = $.extend({
            type: "POST",
            async: false,
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            successfn: function(data) {
            },
            errorfn: function (XMLHttpRequest, textStatus, errorThrown) {
            },
            last: null  // Keep this last line
         }, option);

         var debug = JSON.stringify(op.theObj);

         $.ajax({
            type: op.type,
            url:  op.url,
            async: op.async,
            data: JSON.stringify(op.theObj),
            contentType: op.contentType,
            dataType: op.dataType,
            success: op.successfn,
            error: op.errorfn
         });
      },

      ajaxApiGet: function (option) {
         // default option
         var op = $.extend({
            type: "GET",
            async: false,
            dataType: 'json',
            successfn: function(data) {
            },
            errorfn: function (XMLHttpRequest, textStatus, errorThrown) {
            },
            last: null  // Keep this last line
         }, option);

         $.ajax({
            type: op.type,
            url:  op.url,
            async: op.async,
            dataType: op.dataType,
            success: op.successfn,
            error: op.errorfn
         });
      },

      ajaxApiDelete: function (option) {
         // default option
         var op = $.extend({
            type: "DELETE",
            async: false,
            dataType: 'json',
            successfn: function(data) {
            },
            errorfn: function (XMLHttpRequest, textStatus, errorThrown) {
            },
            last: null  // Keep this last line
         }, option);

         $.ajax({
            type: op.type,
            url:  op.url,
            async: op.async,
            dataType: op.dataType,
            success: op.successfn,
            error: op.errorfn
         });
      },

      version: '0.0.0'
   };

   $.dcmi.lib = {
      /**
       * Convert style text to Obj.
       * @param style
       */
      styleStrToObj: function (style) {
         var temp = new Array();
         temp = style.split(';');
         var obj = {};

         for (var i = 0; i < temp.length; i++) {
            var sArr = temp[i].split(':');
            for (var j = 0; j < sArr.length; j++) {
               sArr[j] = sArr[j].trim();
            }
            if (sArr[0] !== '') {
               obj[sArr[0]] = sArr[1];
            }
         }

         return obj;
      },

      styleObjToStr: function (styleObj) {
         var styleStr = '';
         for (var propertyName in styleObj) {
            if (propertyName !== '') styleStr += propertyName + ': ' + styleObj[propertyName] + '; ';
         }
         return styleStr;
      },

      version: '0.0.0'
   };

   $.dcmi.dialog = {

      message: function(title, msg) {
         $("#messageDialog p").html(msg);
         dialog.messageDialogBox.dialog("option", "title", title);
         dialog.messageDialogBox.dialog("open");
      },

      yesNo: function(title, msg, callbackYes, callbackNo) {

         // Default No
         if (!callbackNo) {
            callbackNo = function () {
               $(this).dialog('close');
            };
         }

         $("#yesNoDialog p").html(msg);
         dialog.yesNoDialogBox.dialog("option", "title", title);
         dialog.yesNoDialogBox.dialog("option", "buttons", {
            'No': callbackNo,
            'Yes': callbackYes
         });
         dialog.yesNoDialogBox.dialog("open");
      },

      version: '0.0.0'
   };

   var dialog = {};
//   dialog.messageDialogBox = null;
//   dialog.yesNoDialogBox = null;

   $(function() {
      dialog.messageDialogBox = $('<div id="messageDialog" style="display:none"><p></p></div>').dialog({
         autoOpen: false,
         bgiframe: true,
         resizable: false,
         draggable: false,
         height:140,
         modal: true,
         overlay: {
            backgroundColor: '#000',
            opacity: 0.5
         },
         buttons: {
            'Ok': function() {
               $(this).dialog('close');
            }
         }
      });

      dialog.yesNoDialogBox = $('<div id="yesNoDialog" style="display:none"><p></p></div>').dialog({
         autoOpen: false,
         bgiframe: true,
         resizable: false,
         draggable: false,
         height:140,
         modal: true,
         overlay: {
            backgroundColor: '#000',
            opacity: 0.5
         },
         buttons: {
            'No': function() {
               $(this).dialog('close');
            },
            'Yes': function() {
               $(this).dialog('close');
            }
         }
      });
   });

})(jQuery);


/**
 * Add trim function to the String object.
 *
 */
String.prototype.trim = function () {
   return this.replace(/^\s*/, "").replace(/\s*$/, "");
};

/**
 * Remove elements of array and return a new array.
 * copy from http://ejohn.org/blog/javascript-array-remove/
 * @param from
 * @param to
 */
Array.prototype.remove = function(from, to) {
   var rest = this.slice((to || from) + 1 || this.length);
   this.length = from < 0 ? this.length + from : from;
   return this.push.apply(this, rest);
};

/**
 * Clone function for prototype pattern.
 * @param object
 */
function clone(object) {
   function F() {
   }

   F.prototype = object;
   return new F;
}

/**
 * Model manager is responsible to access the Ibisj Restful Web Service and send and receive model data.
 *
 * NOTE: no '/' at the end of url (ex.'/json/config/guestportal/layout')
 *
 * @param name
 */
function ModelManager(name) {
   /*
    To Use: set the url first and call ajax embedded functions.
    Example

    var zoneMgr = new ModelManager('zone');
    zoneMgr.url = '...';
    zoneMgr.getModels();
    .. Do something with zoneMgr.models. ..
    */

   if (name) {
      this.name = name;
   }
   this.models = null;
   this.theModel = null;
   this.result = false;
   this.url = '';

   /**
    * Error handeler method
    *
    * @param XMLHttpRequest
    * @param textStatus
    * @param errorThrown
    */
   this.errorCallBack = function(XMLHttpRequest, textStatus, errorThrown) {
      alert("ModelManager: The server has an error at the moment, Please, try again later!");
      return false;
   };

   /**
    * Access Restful Service to get an object list
    *
    */
   this.getModels = function() {
      var thisIt = this;

      var successCallBack = function (data) {
         thisIt.models = data;
         thisIt.result = true;
      };

      var option = {
         successfn: successCallBack,
         errorfn: this.errorCallBack,
         url: ibisjGetContextUrl(this.url)
      };

      $.dcmi.ajaxApi.ajaxApiGet(option);

   };

   /**
    * Access Restful Service to get an object
    *
    * @param id
    */
   this.getOneModel = function(id) {
      var thisIt = this;

      // id or this.theModel.id is used for the key.
      if (!id) {
         if (this.theModel.id) {
            id = this.theModel.id;
         } else {
            return false;
         }
      }

      var successCallBack = function (data) {
         thisIt.theModel = data;
         thisIt.result = true;
      };

      var option = {
         successfn: successCallBack,
         errorfn: this.errorCallBack,
         url: ibisjGetContextUrl(this.url + '/' + id)
      };

      $.dcmi.ajaxApi.ajaxApiGet(option);

   };

   /**
    * Access Restful Service to create an object
    *
    */
   this.createOneModel = function() {
      var thisIt = this;

      var successCallBack = function (data) {
         thisIt.theModel = data;
         thisIt.result = true;
         return true;
      };

      var option = {
         type: 'PUT',
         theObj: this.theModel,
         successfn: successCallBack,
         errorfn: this.errorCallBack,
         url: ibisjGetContextUrl(this.url + '/add')
      };

      $.dcmi.ajaxApi.ajaxApiSave(option);

   };

   /**
    * Access Restful Service to save an object
    *
    */
   this.saveOneModel = function() {
      var thisIt = this;

      var successCallBack = function (message) {
         thisIt.result = true;
      };

      var option = {
         type: 'POST',
         theObj: this.theModel,
         successfn: successCallBack,
         errorfn: this.errorCallBack,
         url: ibisjGetContextUrl(this.url + '/' + this.theModel.id)
      };

      $.dcmi.ajaxApi.ajaxApiSave(option);

   };

   /**
    * Access Restful Service to delete an object
    *
    * @param id
    */
   this.deleteOneModel = function(id) {

      // id or this.theModel.id is used for the key.
      if (!id) {
         if (this.theModel.id) {
            id = this.theModel.id;
         } else {
            return false;
         }
      }

      var thisIt = this;

      var successCallBack = function (message) {
         thisIt.theModel = null;
         thisIt.result = message.result;
         return thisIt.result;
      };

      var option = {
         successfn: successCallBack,
         errorfn: this.errorCallBack,
         url: ibisjGetContextUrl(this.url + '/' + id)
      };

      $.dcmi.ajaxApi.ajaxApiDelete(option);

   };
}

/**
 * The Base Class for all the ibisj manager report page.
 * Contains one dataTables jQuery plugin table and a form popup dialog.
 *
 * @param name
 * @param option
 */
function IbisManagerView(name, option) {

   this.name = name;
   this.p = $.extend({
      idSelect: '',
      formDialogSelect: '',
      tableSelect: '',
      cols: [],
      fnSetDetailFields: function() {
         alert("Please, provide a setDetailFields function for the current View");
      },
      fnBuildObjFromForm: function() {
         alert("Please, provide a buildObjFromForm function for the current View");
      },
      fnUserInit: function() {
      }, // Used to build any static element on the page. e.g. portType drop-down in the port page. 
      fnBuildArrOfObj:  function() {
         alert("Please, provide a buildArrOfObj function for the current View");
      },
      canCreate: true,
      noCreateMsg: 'No new record can be created in this view',
      canDelete: true,
      noDeleteMsg: 'No record can be deleted in this view',
      url: '',
      formDialogSize: { height:350,  width: 400 },
      version: '1.0.0'
   }, option);
   var t = this;

   var mainTable;
   var formDialog;
   var modelMgr;
   var aPos;

   /**
    * Must be called, build table and dialog.
    */
   this.init = function() {

      modelMgr = new ModelManager(name);
      modelMgr.url = t.p.url;

      // build aoColumns from this.p.cols
      t.p.cols.push({
         sWidth: "200px",
         bUseRendered: false,
         fnRender: function(oObj) {

            // Render buttons on insert

            htmlStr = '<div id="row-buttons" class="fg-buttonset ui-helper-clearfix" style="display: block;">';
            htmlStr +=
            '<span class="fg-button ui-state-default fg-button-icon-solo ui-corner-all"><a href="#" class="ui-icon ui-icon-pencil" title="Edit Rule">Edit Port</a></span>';
            htmlStr +=
            '<span class="fg-button ui-state-default fg-button-icon-solo ui-corner-all"><a href="#" class="ui-icon ui-icon-trash" title="Delete Rule">Delete Port</a></span>';
            htmlStr += '</div>';

            return htmlStr;
         }
      });

      // Build the table and form
      initMainTable(t.p.cols);
      initUi();

      // Build user specific init
      t.p.fnUserInit();
   };

   var initMainTable = function (cols) {

      // Setup the port table

      mainTable = $(t.p.tableSelect).dataTable({
         bJQueryUI: true,
         bFilter: false,
         bInfo: false,
         bLengthChange: false,
         bSort: false,
         bPaginate: false,
         bAutoWidth: false,
         aoColumns: cols,
         fnInitComplete: function() {

            // Decorate header and footer

            $(t.p.tableSelect).prev("div.fg-toolbar").append('<div>Configured ' + t.name + '</div>');
            $(t.p.tableSelect).next("div.fg-toolbar").append('<div><span style="float: right;"><button id="' + t.name +
                                                             'createRecord" class="ui-state-default ui-corner-all">' +
                                                             'Create a ' + t.name + '</button></span></div>');
            $('#' + t.name + 'createRecord').click(function() {
               openDialogToCreate();
            });
         }
      });

      // Set event handler per each TR
      $(mainTable.fnGetNodes()).each(function() {
         initTableRowButtons(this);
      });

   };

   var initUi = function () {

      $(".ui-state-default").hover(function() {
         $(t).addClass('ui-state-hover');
      }, function() {
         $(t).removeClass('ui-state-hover');
      });

      // Initialize create rule dialog

      formDialog = $(t.p.formDialogSelect).dialog({
         //      title: "Edit Port",
         autoOpen: false,
         bgiframe: true,
         resizable: false,
         draggable: false,
         height: t.p.formDialogSize.height,
         width:  t.p.formDialogSize.width,
         modal:  true,
         overlay: {
            backgroundColor: '#000',
            opacity: 0.5
         },
         buttons: {
            Cancel: function() {
               $(this).dialog('close');
            },
            Save: function() {
               if (parseInt(($(t.p.formDialogSelect).find(t.p.idSelect).val())) > 0) {
                  // save
                  saveRecord();
               } else {
                  // create
                  createRecord();
               }
               $(this).dialog('close');
            }
         }
      });
   };

   /**
    * Access the table from other script to manipulate it.
    */
   this.getMainTable = function() {
      return mainTable;
   };

   /**
    * When a row is added into the table out side this class, call this function to set the event handlers.
    * @param rowPos
    */
   this.setRowEventHandler = function(rowPos) {
      initTableRowButtons(mainTable.fnGetNodes(rowPos));
   };

   /**
    * TODO: use this.
    * NOTE
    * To use validateForm function add class="ibisj-form-required" to all required fields.
    * Also requres lable for the fields id.
    * Currently P is only its parent.
    * @param $theForm
    */
   var validateForm = function ($theForm) {
      var theResult = true;
      $('.ibisj-form-required', $theForm).each(function (i) {
         if ($(this).val().trim() === '') {
            theResult = false;
            $(this).parent('p').append('<div class="ui-state-error ui-corner-all" style="padding: 0pt 0.7em;">' +
                                       '<span class="ui-icon ui-icon-alert" style="float: left; margin-right: 0.3em;"></span>' +
                                       ' <strong>Alert:</strong> This Field can not be empty.</div>');
         }
      });

      $('.ui-state-error', $theForm).fadeOut(2000, function() {
         $(this).remove();
      });

      return theResult;
   };

   var saveRecord = function () {

      if (! validateForm($(t.p.formDialogSelect))) {
         return false;
      }

      modelMgr.theModel = t.p.fnBuildObjFromForm();

      if (modelMgr.theModel != false) {
         modelMgr.saveOneModel();
         if (modelMgr.result) {
            mainTable.fnUpdate(t.p.fnBuildArrOfObj(modelMgr.theModel), aPos, 0);
            initTableRowButtons(mainTable.fnGetNodes(aPos));
         }
      }
   };

   var createRecord = function () {

      if (! validateForm($(t.p.formDialogSelect))) {
         return false;
      }

      modelMgr.theModel = t.p.fnBuildObjFromForm();

      if (modelMgr.theModel !== false) {
         modelMgr.createOneModel();
         if (modelMgr.result) {
            var index = mainTable.fnAddData(t.p.fnBuildArrOfObj(modelMgr.theModel));
            initTableRowButtons(mainTable.fnGetNodes(index[0]));
         }
      }
   };

   var initTableRowButtons = function (tableRow) {

      var lPos = mainTable.fnGetPosition(tableRow);

      // Edit Button
      $(tableRow).find("a.ui-icon-pencil").parent().click(function() {
         // save it for save function.
         aPos = lPos;
         openDialogToEdit(mainTable.fnGetData(aPos));
      });

      // Delete Button
      $(tableRow).find("a.ui-icon-trash").parent().click(function() {
         deleteRecord(lPos);
      });

   };

   var openDialogToCreate = function () {
      if (t.p.canCreate === true) {
         t.p.fnSetDetailFields();
         formDialog.dialog("option", "title", "Create " + t.name);
         formDialog.dialog("open");
      } else {
         messageDialog("Message", t.p.noCreateMsg);
      }
   };

   var openDialogToEdit = function (aData) {
      t.p.fnSetDetailFields(aData);
      formDialog.dialog("option", "title", "Edit " + t.name);
      formDialog.dialog("open");
   };

   var deleteRecord = function (aPos) {
      if (t.p.canDelete === true) {

         var callbackYes = function(){
            var aData = mainTable.fnGetData(aPos);
            modelMgr.deleteOneModel(aData[0]);
            if (modelMgr.result === true) {
               mainTable.fnDeleteRow(aPos, function(){}, true);
            }
            $(this).dialog('close');
            $.dcmi.dialog.message("Delete", "The record has been deleted");
         };

         $.dcmi.dialog.yesNo("Delete", "Delete the seleted record?", callbackYes);

      } else {
         messageDialog("Message", t.p.noDeleteMsg);
      }
   };

}

/*
 Copyright (c) 2005 JSON.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The Software shall be used for Good, not Evil.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

Array.prototype.______array = '______array';

var JSON = {
   org: 'http://www.JSON.org',
   copyright: '(c)2005 JSON.org',
   license: 'http://www.crockford.com/JSON/license.html',

   stringify: function (arg) {
      var c, i, l, s = '', v;

      switch (typeof arg) {
      case 'object':
         if (arg) {
            if (arg.______array == '______array') {
               for (i = 0; i < arg.length; ++i) {
                  v = this.stringify(arg[i]);
                  if (s) {
                     s += ',';
                  }
                  s += v;
               }
               return '[' + s + ']';
            } else if (typeof arg.toString != 'undefined') {
               for (i in arg) {
                  v = arg[i];
                  if (typeof v != 'undefined' && typeof v != 'function') {
                     v = this.stringify(v);
                     if (s) {
                        s += ',';
                     }
                     s += this.stringify(i) + ':' + v;
                  }
               }
               return '{' + s + '}';
            }
         }
         return 'null';
      case 'number':
         return isFinite(arg) ? String(arg) : 'null';
      case 'string':
         l = arg.length;
         s = '"';
         for (i = 0; i < l; i += 1) {
            c = arg.charAt(i);
            if (c >= ' ') {
               if (c == '\\' || c == '"') {
                  s += '\\';
               }
               s += c;
            } else {
               switch (c) {
               case '\b':
                  s += '\\b';
                  break;
               case '\f':
                  s += '\\f';
                  break;
               case '\n':
                  s += '\\n';
                  break;
               case '\r':
                  s += '\\r';
                  break;
               case '\t':
                  s += '\\t';
                  break;
               default:
                  c = c.charCodeAt();
                  s += '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
               }
            }
         }
         return s + '"';
      case 'boolean':
         return String(arg);
      default:
         return 'null';
      }
   },
   parse: function (text) {
      var at = 0;
      var ch = ' ';

      function error(m) {
         throw {
            name: 'JSONError',
            message: m,
            at: at - 1,
            text: text
         };
      }

      function next() {
         ch = text.charAt(at);
         at += 1;
         return ch;
      }

      function white() {
         while (ch != '' && ch <= ' ') {
            next();
         }
      }

      function str() {
         var i, s = '', t, u;

         if (ch == '"') {
            outer:          while (next()) {
               if (ch == '"') {
                  next();
                  return s;
               } else if (ch == '\\') {
                  switch (next()) {
                  case 'b':
                     s += '\b';
                     break;
                  case 'f':
                     s += '\f';
                     break;
                  case 'n':
                     s += '\n';
                     break;
                  case 'r':
                     s += '\r';
                     break;
                  case 't':
                     s += '\t';
                     break;
                  case 'u':
                     u = 0;
                     for (i = 0; i < 4; i += 1) {
                        t = parseInt(next(), 16);
                        if (!isFinite(t)) {
                           break outer;
                        }
                        u = u * 16 + t;
                     }
                     s += String.fromCharCode(u);
                     break;
                  default:
                     s += ch;
                  }
               } else {
                  s += ch;
               }
            }
         }
         error("Bad string");
      }

      function arr() {
         var a = [];

         if (ch == '[') {
            next();
            white();
            if (ch == ']') {
               next();
               return a;
            }
            while (ch) {
               a.push(val());
               white();
               if (ch == ']') {
                  next();
                  return a;
               } else if (ch != ',') {
                  break;
               }
               next();
               white();
            }
         }
         error("Bad array");
      }

      function obj() {
         var k, o = {};

         if (ch == '{') {
            next();
            white();
            if (ch == '}') {
               next();
               return o;
            }
            while (ch) {
               k = str();
               white();
               if (ch != ':') {
                  break;
               }
               next();
               o[k] = val();
               white();
               if (ch == '}') {
                  next();
                  return o;
               } else if (ch != ',') {
                  break;
               }
               next();
               white();
            }
         }
         error("Bad object");
      }

      function num() {
         var n = '', v;
         if (ch == '-') {
            n = '-';
            next();
         }
         while (ch >= '0' && ch <= '9') {
            n += ch;
            next();
         }
         if (ch == '.') {
            n += '.';
            while (next() && ch >= '0' && ch <= '9') {
               n += ch;
            }
         }
         if (ch == 'e' || ch == 'E') {
            n += 'e';
            next();
            if (ch == '-' || ch == '+') {
               n += ch;
               next();
            }
            while (ch >= '0' && ch <= '9') {
               n += ch;
               next();
            }
         }
         v = +n;
         if (!isFinite(v)) {
            error("Bad number");
         } else {
            return v;
         }
      }

      function word() {
         switch (ch) {
         case 't':
            if (next() == 'r' && next() == 'u' && next() == 'e') {
               next();
               return true;
            }
            break;
         case 'f':
            if (next() == 'a' && next() == 'l' && next() == 's' && next() == 'e') {
               next();
               return false;
            }
            break;
         case 'n':
            if (next() == 'u' && next() == 'l' && next() == 'l') {
               next();
               return null;
            }
            break;
         }
         error("Syntax error");
      }

      function val() {
         white();
         switch (ch) {
         case '{':
            return obj();
         case '[':
            return arr();
         case '"':
            return str();
         case '-':
            return num();
         default:
            return ch >= '0' && ch <= '9' ? num() : word();
         }
      }

      return val();
   }
};
