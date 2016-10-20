/**
 * $Id$
 *
 * dcmi.gp.js
 * Developer Daniel Chealwoo Lee
 *
 * Copyright (c) Nomadix 2009, All rights reserved.
 *
 * javascript of guest portal HTML editor used in ibis.
 *
 * Requirements:
 * jquery 1.3.2
 * jquery UI
 */

(function($) {

   jQuery.gp = function () {
   };

   jQuery.gp.editor = function () {
   };

   /*****************************************************
    * Default layout editor object.
    * Singleton Class Layout
    *  $.gp.editor
    *****************************************************/
   $.gp.editor.SCLayout = {
      /**
       *
       */
      $this: null,
      window: null,
      ajaxMgr: new ModelManager('layout'),

      /**
       * Data variables
       */
      d: {
         id: -1,
         name:'',
         desc:'',
         zoneId: null   // Get the zone info on the fly.
      },

      /**
       * Property variables
       */
      c: {
         url: '/json/config/guestportal/layout' ,
         zoneUrl: '/json/config/billing/zone',
         jPickerOption : {
            window: // used to define the position of the popup window
               // only useful in binded mode
            {
               title: 'Background Color Selector', // any title for the jPicker window itself - displays
               // "Drag Markers To Pick A Color" if left null
               position:
               {
                  x: 0, // acceptable values "left", "center", "right",
                  // "screenCenter", or relative px value
                  y: 0 // acceptable values "top", "bottom", "center", or relative px value
               },
               expandable: true, // default to large static picker - set to true to make an
               // expandable picker (small icon with popup) - set
               // automatically when binded to input element
               liveUpdate: true // set false if you want the user to click "OK" before the
               // binded input box updates values
            },
            color:
            {
               mode: 'h', // acceptable values "h" (hue), "s" (saturation), "v" (brightness),
               // "r" (red), "g" (green), "b" (blue)
               active: new $.jPicker.Color({ hex: 'ffc000' }), // accepts any declared
               // jPicker.Color object or hex string INCLUDING '#'
               alphaSupport: false, // change to true to enable alpha editing support (without
               // this, alpha will always be 100)
               quickList: // this list of quick pick colors - override for a different list
                     [
                        new $.jPicker.Color({ h: 360, s: 33, v: 100}), // accepts any declared
                        // jPicker.Color object or hex string INCLUDING '#'
                        new $.jPicker.Color({ h: 360, s: 66, v: 100}),
                        // (...)removed for brevity
                        new $.jPicker.Color({ h: 330, s: 100, v: 50})
                     ]
            },
            images:
            {
               clientPath: ibisjGetContextUrl('/js/plugins/jpicker-1.0.10/images/'), // Path to image files
               colorMap: // colorMap size and arrow icon
               {
                  width: 256, // Map width - don't override unless using a smaller image set
                  height: 256, // Map height - don't override unles using a smaller image set
                  arrow:
                  {
                     file: 'mappoint.gif', // Arrow icon image file
                     width: 15, // Arrow icon width
                     height: 15 // Arrow icon height
                  }
               },
               colorBar: // colorBar size and arrow icon
               {
                  width: 20, // Bar width - don't override unless using a smaller image set
                  height: 256, // Bar height - don't override unless using a smaller image set
                  arrow:
                  {
                     file: 'rangearrows.gif', // Arrow icon image file
                     width: 40, // Arrow icon width
                     height: 9 // Arrow icon height
                  }
               },
               alphaBar: // alphaBar size and arrow icon
               {
                  width: 256, // Bar width - don't override unless using a smaller image set
                  height: 20, // Bar height - don't override unless using a smaller image set
                  arrow:
                  {
                     file: 'rangearrows2.gif', // Arrow icon image file
                     width: 9, // Arrow icon width
                     height: 40 // Arrow icon height
                  }
               },
               picker: // picker icon and size
               {
                  file: 'picker.gif', // Picker icon image file
                  width: 25, // Picker width - don't override unless using a smaller image set
                  height: 24  // Picker height - don't override unless using a smaller image set
               }
            }
         }
      },

      /**
       * view variables
       */
      v: { },

      init: function () {

         this.$this = null; // the layout has no jQuery object.
         this.ajaxMgr.url = this.c.url;

         this.buildView();

         this.window = $.gp.editor.SCWindow;   // Assign reference to the Window Singleton object.
         this.window.init();

         $(".widget-box").draggable({ helper: 'clone' });

         this.d.id = parseInt(this.v.$hidLayoutId.val());
         // Last open saved if id is set.
         if (this.d.id > 0) {
            this.openSaved(this.d.id);
         }

      },

      buildView: function () {
         this.v.$hidLayoutId = $('#hidLayoutId');    // layout id hidden text box
         this.v.$txtLayoutName = $('#txtLayoutName');
         this.v.$txtLayoutDesc = $('#txtLayoutDesc');
         this.v.$mainMsg = $("#msgMain");           // $.gp.editor.$mainMsg
         this.v.$messageBox = $("#divMessage");  // $.gp.editor.$messageBox
         this.v.$subBoxEditing = {};
         this.v.$sltZone = $('#sltZone');            // select element of zone
         this.populateZone();
         this.v.$btnSave = $("#btnSave");
         this.v.$btnPreview = $('#btnPreview');
         this.v.$btnSaveClose = $("#btnSaveClose");

         var thisIt = this;

         this.v.$txtLayoutName.change(function () {
            thisIt.d.name = $(this).val();
         });

         this.v.$txtLayoutDesc.change(function () {
            thisIt.d.desc = $(this).val();
         });

         this.v.$btnSave.click(function() {
            thisIt.saveCurrent();
         });

         this.v.$btnPreview.click(function() {
            if (thisIt.saveCurrent() === true) {
               thisIt.openPreview(thisIt.d.id);
            } else {
               alert("Error while saving the layout!");
            }
         });

         this.v.$btnSaveClose.click(function() {
            thisIt.saveCurrent();
            window.close();
         });

      },

      openPreview: function(id) {        // http://10.1.1.73:8080/ibisjmgr/ui/config/guestportal/layout/preview/2
          window.open('preview/' + id ,'default', 'location=0,left=20,top=20,width=900,height=700,toolbar=0,menubar=0,resizable=1,scrollbars=1');
      },

      displayMsg: function (text) {
         this.v.$messageBox.text(text);
      },

      populateZone: function() {
         var zoneMgr = new ModelManager();
         zoneMgr.url = this.c.zoneUrl;
         zoneMgr.getModels();

         if (zoneMgr.result === true && this.v.$sltZone.length === 1) {
            for (var i = 0; i < zoneMgr.models.length; i++) {
               var aOption = document.createElement('option');
               $(aOption).data("zone", zoneMgr.models[i]);
               $(aOption).val(zoneMgr.models[i].id).text(zoneMgr.models[i].name).appendTo(this.v.$sltZone);
               if (i === 0) {
                  $(aOption).attr("selected", true);
               }
               aOption = null;
            }
         }

         // zone change handler can be set here to update this.d.zoneId -> not doing.
      },

      toObj: function() {
         var theObj = {
            id: this.d.id,
            name: this.d.name,
            desc: this.d.desc,
            zone: $('#sltZone option:selected').data("zone")
         };

         theObj['window'] = this.window.toObj();

         return theObj;
      },

      /**
       * Save current
       *
       */
      saveCurrent: function () {

         $('#btnSave, #btnSaveClose').attr("disabled", true);

         while ($('#txtLayoutName').val() === '') {
            this.d.name = prompt('Please, enter the name of layout');
            if (this.d.name === null) {
               return false;
            }
            this.window.setDName(this.d.name);
            $('#txtLayoutName').val(this.d.name);
         }

         this.ajaxMgr.theModel = this.toObj();

         if (this.d.id > 0) {
            this.ajaxMgr.saveOneModel();
         } else {
            this.ajaxMgr.createOneModel();
         }

         if (this.ajaxMgr.result === true && this.ajaxMgr.theModel.id > 0) {
            this.openSavedCallBack(this.ajaxMgr.theModel);
         }

         $('#btnSave, #btnSaveClose').removeAttr("disabled");

         return this.ajaxMgr.result;
      },

      /**
       * Open Saved
       *
       */
      openSaved: function (id) {

         this.ajaxMgr.getOneModel(id);
         if (this.ajaxMgr.result === true) {
            this.openSavedCallBack(this.ajaxMgr.theModel);
         }
      },

      openSavedCallBack: function(layout) {
         this.d.id = layout.id;
         this.d.name = layout.name;
         this.d.desc = layout.desc;
         this.v.$txtLayoutName.val(layout.name);
         this.v.$txtLayoutDesc.val(layout.desc);

         if (layout.zone) {
            $('#sltZone option:selected').attr('selected', false);
            $("#sltZone option:[value='" + layout.zone.id + "']").attr('selected', true);
         }

         if (layout.window) {
            this.window.openSaved(layout.window);
         }
      },

      version : '1.0.0'

   };  // End of $.gp.editor def

   /******************************************************
    * Object contains window functions
    *
    ******************************************************/
   $.gp.editor.SCWindow = {
      $this: null,
      data: null,
      c: {
         defaultHeight: 800,
         widthOffset: 12
      },
      d: { id: -1, name: '', width: 900, style: {} },
      v: {  },
      seqNum: 0,              // increases forever so each panel can have a unique internal id.
      panels: [],
      currentPanelId: null,

      /**
       * init function.
       * 
       * Set $this object.
       * Set Default values
       * Call BuildView()
       */
      init: function () {

         this.$this = $("#gpWindow");

         this.$this.resizable({
            maxWidth: this.d.width,
            minWidth: this.d.width,
            minHeight: this.c.defaultHeight
         });

         this.d.style = $.dcmi.lib.styleStrToObj(this.$this.attr('style'));

         this.buildView();
      },

      buildView: function() {
         // Windows view elements
         this.v.$btnChangeWidth = $("#btnWindowWidth");
         this.v.$txtWindowWidth = $('#txtWindowWidth');
         // Panel command view elements
         this.v.$btnAddPanel = $("#btnAdd");
         this.v.$btnDelPanel = $("#btnDel");
         this.v.$btnEditPanel = $("#btn2TinyMce"),this.v.$txtWidth = null;
         this.v.$selBgImgOfPanel = $("#bgImgSelector");
         this.v.$pickerBgColorOfPanel = $('#bgSelector');
         this.v.$windowBgColorOfPanel = $('#windowBgSelector');
         this.v.$sltWindowAline = $('#sltWindowAline');
         this.v.$txtLayoutName = $('#txtLayoutName');
         this.v.$gpWindowWrap = $('#gpWindowWrap');
         this.v.$btnCalSize = $('#btnCalSize');

         var thisIt = this;
         // Set Window's Event Handlers
         this.v.$btnChangeWidth.click(function() {
            thisIt.changeWindowWidth(thisIt.v.$txtWindowWidth.val());
            thisIt.d.width = $(this).val();
         });

         // Panel commands
         this.v.$btnAddPanel.click(function() {
            thisIt.addPanel();
         });

         this.v.$btnDelPanel.click(function() {
            thisIt.deleteSelectedPanel();
         });

         this.v.$btnEditPanel.click(function() {
            thisIt.editSelectedPanel();
         });

         this.v.$windowBgColorOfPanel.jPicker($.gp.editor.SCLayout.c.jPickerOption, function(color) {
            var $selected = $("#gpWindow");
            $selected.css({ backgroundColor: '#' + color.hex });
            thisIt.d.style.backgroundColor = '#' + color.hex;
            $('.sub-display', $selected).css({ backgroundColor: '#' + color.hex });
         }, function(color) {
            // Live
         }, function(color) {
            // Cancel
         });

         this.v.$pickerBgColorOfPanel.jPicker($.gp.editor.SCLayout.c.jPickerOption, function(color) {
            // Commit
            // alert('Color chosen - hex: #' + color.hex + ' - alpha: ' + color.a + '%');
            // $('#Commit').css({ backgroundColor: '#' + color.hex });
            var $selected = $(".sub-box-selected", thisIt.$this);
            // $selected.css( 'background-color', $(this).val() );
            $selected.css({ backgroundColor: '#' + color.hex });
            $selected.css({ 'background-image': 'none' });
            $('.sub-display', $selected).css({ backgroundColor: '#' + color.hex });
         }, function(color) {
            // Live
         }, function(color) {
            // Cancel
         });

         this.v.$selBgImgOfPanel.change(function() {
            thisIt.panels[thisIt.currentPanelId].setPanelBgImg(this);
         });

         this.v.$sltWindowAline.change(function() {
            thisIt.d.style.margin = $(this).val();
         });

         this.v.$txtLayoutName.change(function () {
            thisIt.setDName($(this).val());
         });

         this.v.$btnCalSize.click(function() {
            var box = thisIt.calBestSize( thisIt.currentPanelId );
            thisIt.panels[thisIt.currentPanelId].$this.width(box.width);
            thisIt.panels[thisIt.currentPanelId].$this.height(box.height);            
         });

      },

      /**
       *
       * @param data
       */
      openSaved: function(data) {
         this.data = data;
         this.d.id = data.id;
         this.d.name = data.name;
         this.d.width = data.width;
         this.d.style = $.dcmi.lib.styleStrToObj(data.style);
//         var objString = data.style.replace(/;/g, ',');
//         var newObjString = "this.d.style = {" + objString.slice(0, objString.lastIndexOf(',') ) + objString.slice(objString.lastIndexOf(',') + 1) + " }";
//         eval( newObjString );
         this.changeWindowWidth(data.width);

         var panels = data.panels;
         panels.sort(this.panleSortfunction);
         this.addPanels(panels.length, panels);
      },

      toObj: function() {

         var buf1 = $.dcmi.lib.styleObjToStr(this.d.style);
         var buf2 = JSON.stringify(this.d.style);

         var theWindow = {
            id: this.d.id,
            name: this.d.name,
            width: this.d.width,
            style: $.dcmi.lib.styleObjToStr(this.d.style)
//            style: JSON.stringify(this.d.style)
         };

         var thePanels = [];
         for (var i = 0; i < this.panels.length; i++) {
            thePanels.push(this.panels[i].toObj());
         }

         theWindow['panels'] = thePanels;

         return theWindow;
      },

      /**
       * Change the gpWindow width
       *
       */
      changeWindowWidth: function (width) {
         this.d.width = parseInt(width);
         $(".ui-resizable", this.$this).width(this.d.width - 12);
         this.$this.resizable('option', 'maxWidth', this.d.width).resizable('option', 'minWidth', this.d.width).width(this.d.width);
         this.v.$gpWindowWrap.width(this.d.width);
      },

      adjustWindowHeight: function (height) {
         this.v.$gpWindowWrap.height( height > this.c.defaultHeight ? height : this.c.defaultHeight );
      },

      buildPanel2DArray: function () {

      },

      // add -window to the current name.
      setDName: function(name) {
         this.d.name = name + "-window";
      },

      // this.d is reset with the argument d.
      setD: function(d) {
         for (var name in d) {
            if (this.d[name]) {
               this.d[name] = d[name];
            }
         }
      },

      // panel functions
			
      /**
       * $.gp.editor.addPanels()
       * - Add resizable boxes by calling addComponentBox() function
       *
       */
      addPanels: function (numberofboxes, boxes) {
         this.deleteAllPanels();

         for (var i = 0; i < numberofboxes; i++) {
            var panel = boxes[i];
            this.addPanel(panel);
         }
      },

      /**
       * Add a single panel
       * @param panel
       */
      addPanel: function (box) {

         var thisIt = this;

         var aPanel = clone($.gp.editor.CPanel);
         aPanel.$this = null;
         aPanel.data = null;
         aPanel.$container = null;
         aPanel.internalId = -1;

         // NOTE the d value has to be updated at all the time.
         aPanel.d = { id: -1, name: '', index: -1, width: 0, height: 0, style: '', content: '' };

         aPanel.v = { $tmpHeader: null, $textBox: null, $displayBox: null };

         if (!box) {
            box = this.calBestSize();
         }

         // Add Panel
         //
         aPanel.init(this.seqNum++, box, this.$this);

         // Set the index.
         aPanel.d.index = this.panels.length;
         // add another click handler to set the currentPanelId
         // I am interested in seeing the two handlers are both assigned.
         aPanel.$this.click(function() {

            thisIt.currentPanelId = aPanel.d.index;

            if (aPanel.$this.hasClass('sub-box-selected')) {
               aPanel.$this.removeClass('sub-box-selected');
               thisIt.enablePanelMenu(thisIt, false);
            } else {
               $(".sub-box-selected").removeClass('sub-box-selected');
               aPanel.$this.addClass('sub-box-selected');
               thisIt.enablePanelMenu(thisIt, true);
               var l_info = "current width: " + aPanel.$this.width() + " / height: " + aPanel.$this.height();
               $("#msgMain").text(l_info);
            }
         });
         // TODO: s3 - add a function to reset grid after resize.
         /* NOTE: the grid from resizable (code below) allows snap to the grid value but doesn't let the width move freely.
         aPanel.$this.bind('resizestop', function(event, ui) {
            function getPanelsOfSameRow(theTop) {
               var arrPanel = [];
               $(".ui-resizable", thisIt.$this).foreach(function() {
                  if ($(this).position().top === theTop) {
                     arrPanel.push(this);
                  }
               });
               return arrPanel;
            }        
         });
         */

         // Add panle into the panels array.
         this.panels.push(aPanel);
         this.adjustWindowHeight(aPanel.$this.position().top + aPanel.$this.height());

      },

      /**
       * delete all panels
       */
      deleteAllPanels: function() {
         for (var i = 0; i < this.panels.length; i++) {
            this.panels[i].distroy();
         }
         this.currentPanelId = -1;
         this.panels = [];
      },

      /**
       * Delete the selected sub div panel
       *
       */
      deleteSelectedPanel: function () {
         if (this.currentPanelId >= 0 && this.currentPanelId < this.panels.length) {
            var $selected = this.panels[this.currentPanelId].$this;

            var l_confirm = window.confirm("Are you sure you want to delete the selected box?");
            if (l_confirm) {
               this.deletePanel(this.currentPanelId);
            }
         } else {
            alert("Plese, select a sub box");
         }
      },

      /**
       * Delete a panel
       * @param $panel
       */
      deletePanel: function(index) {
         this.panels[index].distroy();
         // rebuild index.
         this.currentPanelId = -1;
         this.panels.remove(index);
         for (var i = 0; i < this.panels.length; i++) {
            this.panels[i].d.index = i;
         }
      },

      /**
       * Initiate TinyMCE on the selected panel
       *
       */
      editSelectedPanel: function () {
         $.gp.editor.tinyMce.init( this.panels[this.currentPanelId].$this );
      },

      /**
       * Library function
       * Calcurate the best size to fit into the gpWindow.
       */
      calBestSize: function ( currentPanelId ) {
         var containerWidth = this.$this.width();
         var bestWidth = containerWidth - this.c.widthOffset;
         var bestHeight = 100;

         var $p;
         if ( currentPanelId && currentPanelId !== 0 ) {
            $p = this.panels[currentPanelId - 1].$this;
            // D Note: may set $p to empty if the curent Panel is the first in the row.
         } else {
            $p = $(".ui-resizable:last", this.$this);
         }

         var lastX = bestWidth;

         if ($p.size() > 0) {
            var position = $p.position();

            lastX = position.left + $p.width();
            bestHeight = $p.height();
         }

         var currentBoxWidth80 = (( lastX / containerWidth ) * 100 );
         if (currentBoxWidth80 < 80) {
            bestWidth = bestWidth - lastX - 12;
         }

         return { height: bestHeight, width: bestWidth };
      },

      panleSortfunction: function (a, b) {
         return (a.index - b.index); //causes an array to be sorted numerically and ascending
      },

      enablePanelMenu: function(thisIt, on) {
         if (on) {
            thisIt.v.$btnDelPanel.attr("disabled", "");
            thisIt.v.$btnEditPanel.attr("disabled", "");
            thisIt.v.$selBgImgOfPanel.attr("disabled", "");
            thisIt.v.$btnCalSize.attr("disabled", "");
         } else {
            thisIt.v.$btnDelPanel.attr("disabled", "disabled");
            thisIt.v.$btnEditPanel.attr("disabled", "disabled");
            thisIt.v.$selBgImgOfPanel.attr("disabled", "disabled");
            thisIt.v.$btnCalSize.attr("disabled", "disabled");
         }
      },

      /**
       * This function reset resize .grid[x,y] according to its left panel
       */
      resetPanelOptions: function() {
         // Check it has a panel in its left side in the same row.

      },

      version: '1.0.0'
      /*
       1.0.0 - 2009/10/01  First Version.
       1.1.0 - 2009/10/29  Converted to CWindow Class. 
       */
   };

   /*********************************************
    * Prototype CPanel
    ********************************************/
   $.gp.editor.CPanel = {
      $this: null,
      data: null,
      $container: null,
      internalId: -1,

      c: {
         defaultWidth: 200,
         defaultHeight: 200,
         panelClassName: 'ui-widget-content',
         panelHeader: '<h3 class="ui-widget-header">Title</h3>',
         panelTextBox: '<textarea name="elm1" rows="15" cols="80" style="width: 100%" class="tinymce-textarea hidden"></textarea>',
         panelDisplayBox: '<div class="sub-display"></div>'
      },

      // NOTE the d value has to be updated at all the time.
      d: {
         id: -1,
         name: '',
         index: -1,
         width: 0,
         height: 0,
         style: '',
         content: ''
      },

      v: { },

      // convert this instance to javascript object. The value d is the object.
      toObj: function() {
         this.d.style = this.$this.attr('style');
         this.d.content = this.v.$displayBox.html();
         return this.d;
      },

      buildView: function() {
         this.v.$tmpHeader = $(".ui-widget-header", this.$this);
         this.v.$textBox = $(".tinymce-textarea", this.$this);
         this.v.$displayBox = $(".sub-display", this.$this);
      },

      /**
       * Create div panel
       * @param box - data about a new div panel
       */
      init: function (i, box, $Window) {

         this.internalId = i;
         this.data = box;
         this.$container = $Window;

         if (this.data.id) {
            this.d.id = this.data.id;
            this.d.name = this.data.name + this.d.id;
         } else {
            this.d.name = '' + Date();
         }

         this.d.width = this.data.width;
         this.d.height = this.data.height;

         this.$this = $(document.createElement('div'));
         this.$this.attr('id', 'resizable' + i).addClass(this.c.panelClassName).appendTo($Window);

         this.$this.width(parseInt(this.d.width)).height(parseInt(this.d.height)).append(this.c.panelHeader).append(this.c.panelTextBox).append(this.c.panelDisplayBox);

         this.buildView();

         if (this.data.content) {
            this.d.content = this.data.content;
            this.v.$tmpHeader.remove();
            this.v.$displayBox.html(this.d.content);
         }

         if (this.data.style) {
            this.d.style = this.data.style;
            this.$this.attr('style', this.d.style);
         }

         this.$this.resizable({
            containment: '#gpWindow'
           // ,            grid: [box.width, box.height]
         });

         // Select Event
         this.defaultBehavior();

         //
         this.widgetDrappHandler();
      },

      getStatus: function() {
         // Will return current status.
      },

      /**
       * Add all default handle functions.
       *
       * @param $resizable
       */
      defaultBehavior : function () {
         var thisIt = this;
         this.$this.mouseover(function() {
            $(this).css({ cursor: 'pointer' });
         }).mouseout(function() {
            $(this).css({ cursor: 'default' });
         }).bind('resize', function(e, ui) {
            var $l_msg = $("#msgMain");
            var l_info = "current width: " + $(this).width() + " / height: " + $(this).height();
            thisIt.d.width = $(this).width();
            thisIt.d.height = $(this).height();
            $l_msg.text(l_info);
         });
      },

      setPanelBgImg: function(option) {
         this.$this.css({ backgroundImage : 'url(' + $(option).val() + ')' });
         this.d.style = this.$this.attr('style');
      },

      /**
       * Action when a widget is dropped into a DIV panel
       *
       * @param $resizable
       */
      widgetDrappHandler : function () {
         var thisIt = this;
         this.$this.droppable({
            drop: function(event, ui) {
               $(".ui-widget-header", this.$this).remove();   // do i know this here?

               if (ui.draggable[0].id === 'widgetWeatherRss') {
                  $.gp.widget.weatherRss.box = this;
                  $.gp.widget.weatherRss.build();

               } else if (ui.draggable[0].id === 'widgetInfo') {
                  $.gp.widget.authentication.box = this;
                  $.gp.widget.authentication.url = '/js/config/guestportal/widget/wauthentidation.jsp';
                  $.gp.widget.authentication.build();
                  // TODO: -s3 reset min size of the panel
                  // NOTE What to do if the panel is located in middle and resizing would infect the whole layout?

               } else if (ui.draggable[0].id === 'widgetBillPlan') {
                  $.gp.widget.billPlanSelect.box = this;
                  $.gp.widget.billPlanSelect.url = '/js/config/guestportal/widget/billplan_selection.jsp';
                  $.gp.widget.billPlanSelect.build();

               } else if (ui.draggable[0].id === 'widgetBillPlanRadio') {
                  $.gp.widget.billPlanRadio.box = this;
                  $.gp.widget.billPlanRadio.url = '/js/config/guestportal/widget/billplan_radio.jsp';
                  $.gp.widget.billPlanRadio.build();

               } else {

               }
            }
         });
      },

      distroy: function() {
         this.$this.resizable('destroy').unbind().remove();
      },

      version : '1.1.0'
      /* Log
       1.0.0 - 2009.10.01   Firstversion.
       1.1.0 - 2009.10.28   Converted to class
       */
   };

   /******************************************************
    * Object contains tinyMCE functions
    *
    ******************************************************/
   $.gp.editor.tinyMce = {

      init: function ($panel) {
         if ($panel.size() === 1) {
            $.gp.editor.tinyMce.addTinyMce($panel);
         }
      },

      /**
       * Adding a tinyMCE editor into the selected sub div.
       * @param $subBox
       */
      addTinyMce: function ($subBox) {
         $(".ui-widget-header", $subBox).remove();

         var $textareaTinyMce = $('textarea.tinymce-textarea', $subBox);
         $.gp.editor.$subBoxEditing = $subBox;

         var $displayBox = $('div.sub-display', $subBox);
         // Copy current show box html to edit box value
         $textareaTinyMce.val($displayBox.html());

         // Toggle between show box and edit box.
         $textareaTinyMce.removeClass('hidden');
         $('div.sub-display', $subBox).addClass('hidden');

         $('textarea.tinymce-textarea', $subBox).tinymce({
            // Location of TinyMCE script
            script_url : ibisjGetContextUrl('/js/tinymce/tiny_mce.js'),

            // General options
            theme : "advanced",
            plugins : "safari,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",

            // Theme options
            theme_advanced_buttons1 : "mybutton,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
            theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
            theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
            theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
            theme_advanced_toolbar_location : "top",
            theme_advanced_toolbar_align : "left",
            theme_advanced_statusbar_location : "bottom",
            theme_advanced_resizing : true,

            // Example content CSS (should be your site CSS)
            content_css : "css/content.css",

            // Drop lists for link/image/media/template dialogs
            template_external_list_url : "lists/template_list.js",
            external_link_list_url : "lists/link_list.js",
            external_image_list_url : "lists/image_list.js",
            media_external_list_url : "lists/media_list.js",

            setup : function(ed) {
               // Add a custom button
               // http://tinymce.moxiecode.com/examples/example_20.php
               ed.addButton('mybutton', {
                  title : 'My button',
                  image : ibisjGetContextUrl('/images/icon_save.gif'),
                  onclick : $.gp.editor.tinyMce.saveTinyMce
               });
            },

            // Replace values for the template plugin
            template_replace_values : {
               username : "Some User",
               staffid : "991234"
            }

         });

         var $mce_save = $('.mce_save', $textareaTinyMce);
         $mce_save.unbind();
      } ,

      /**
       * Remove tinyMCE editor and go back to normal display mode of div.
       *
       * $.gp.editor.tinyMce.saveTinyMce
       */
      saveTinyMce: function() {
         var $subBox = new Object($.gp.editor.$subBoxEditing);
         $.gp.editor.$subBoxEditing = null;

         var $textareaTinyMce = $('textarea.tinymce-textarea', $subBox);
         var $displayBox = $('div.sub-display', $subBox);

         $displayBox.html($textareaTinyMce.val());
         $textareaTinyMce.tinymce().hide();
         $textareaTinyMce.addClass('hidden');
         $displayBox.removeClass('hidden');
      },

      version : '1.0.0'

   };  // End of $.gp.editor def

   /******************************************************
    * Contains functions of divs in the container div
    *
    ******************************************************/
   jQuery.gp.widget = function() {
   };

   /**
    * Create the Base widget class
    */
   $.gp.widget.Base = {

      box : null,
      url : null,
      size : { width: 0, height: 0 },

      build : function() {
         var thisIt = this;
         var htmlContent;

         $.get(ibisjGetContextUrl(thisIt.url), function(data) {
            htmlContent = data;

            var divWidget = document.createElement('div');
            $(divWidget).html(htmlContent);
            $('.sub-display', thisIt.box).append(divWidget);
         });
      },

      version : '1.0.0'
   };

   /**
    * Prototype inheritance and create objects.
    *
    */
   $.gp.widget.billPlanSelect = clone(jQuery.gp.widget.Base);
   $.gp.widget.billPlanRadio = clone(jQuery.gp.widget.Base);
   $.gp.widget.authentication = clone(jQuery.gp.widget.Base);
   $.gp.widget.weatherRss = clone(jQuery.gp.widget.Base);
   $.gp.widget.weatherRss.build = function() {
      var thisIt = this;

      var divWidget = document.createElement('div');
      $(divWidget).html("<strong>WeatherRss has been added</strong>");
      $('.sub-display', thisIt.box).append(divWidget);
   };

})(jQuery);

