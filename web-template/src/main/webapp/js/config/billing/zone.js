// JavaScript Document

/**
 * \$Id: zone.js 65 2009-10-08 19:07:30Z daniel.lee $
 * zone.js
 * Version: DLee
 * Date: Oct 08, 2009  Time: 3:15:58 PM
 * Copyright (c) Nomadix 2009, All rights reserved.
 */

(function($) {

   $(function() {

      var tableSelect = "#tblZone";
      var formDialogSelect = '#zoneDetailDialog';
      var idSelect = '#zoneId';

      var setDetailFields = function (aData) {
         if (!aData) {                             // "name", "description", "classOfService", "ports"
            aData = ["-1", "", "", "0"];
         }

         var $detailDialog = $(formDialogSelect);

         $detailDialog.find("#zoneId").val(aData[0]);
         $detailDialog.find("#zoneName").val(aData[1]);
         $detailDialog.find("#zoneDescription").val(aData[2]);
         $detailDialog.find("#zoneClassOfService").val(aData[3]);

         // populates all ports.
         $detailDialog.find('#allPorts').empty();
         $.dcmi.ajaxApi.ajaxApiGet({
            successfn: function(msg) {
               for (var i = 0; i < msg.length; i++) {
                  $detailDialog.find('#allPorts').append('<option value="' + msg[i].id + '">' + msg[i].portNumber +
                                                         '(' + msg[i].deviceName + ')' + '</option>');
               }
            },
            errorfn: function () {
               alert("The server has an error at the moment, Please, try again later!");
            },
            url: ibisjGetContextUrl('/json/config/facilities/ports')
         });

         // populates zone ports.
         $detailDialog.find('#zonePorts').empty();
         if (parseInt(aData[0]) > 0) {
            $.dcmi.ajaxApi.ajaxApiGet({
               successfn: function(msg) {
                  for (var i = 0; i < msg.ports.length; i++) {
                     $detailDialog.find('#zonePorts').append('<option value="' + msg.ports[i].id + '">' +
                                                             msg.ports[i].portNumber + '(' + msg.ports[i].deviceName +
                                                             ')' + '</option>');
                     $("#allPorts option[value='" + msg.ports[i].id + "']").remove();
                  }
               },
               errorfn: function () {
                  alert("The server has an error at the moment, Please, try again later!");
               },
               url: ibisjGetContextUrl('/json/config/billing/zone/' + aData[0])
            });
         }

         $detailDialog.find('#removePorts').click(function() {
            return !$detailDialog.find('#zonePorts option:selected').remove().appendTo('#allPorts');
         });
         $detailDialog.find('#addPorts').click(function() {
            return !$detailDialog.find('#allPorts option:selected').remove().appendTo('#zonePorts');
         });

      };

      var buildObjFromForm = function () {

         var $detailDialog = $(formDialogSelect);

         var $ports = $('#zonePorts option', $detailDialog);

         var thePorts = [];
         for (var i = 0; i < $ports.length; i++) {
            port = $ports.get(i);
            var $port = $(port);
            var theport = {
               id: parseInt($port.val())
            };
            thePorts.push(theport);
         }

         return theObj = {
            id: parseInt($('#zoneId', $detailDialog).val()),
            name: $('#zoneName', $detailDialog).val(),
            description: $('#zoneDescription', $detailDialog).val(),
            classOfService: $('#zoneClassOfService', $detailDialog).val(),
            ports: thePorts
         };

      };

      var userInit = function () {
         // Additional build in dialog.

      };

      var buildArrOfObj = function (o) {
         if (o) {
            return [o.id,  o.name,  o.description, o.classOfService, "" ];
         }
      };

      var cols = [
         {
            bVisible: false
         },
         {
            sTitle: "Zone Name",
            sWidth: "150px"
         },
         {
            sTitle: "Description"
         },
         {
            sTitle: "Class of Service"
         }
      ];

      var zonePage = new IbisManagerView('Zone', {
         tableSelect: tableSelect,
         formDialogSelect: formDialogSelect,
         idSelect: idSelect,
         fnSetDetailFields: setDetailFields,
         fnBuildObjFromForm: buildObjFromForm,
         fnUserInit: userInit,
         fnBuildArrOfObj: buildArrOfObj,
         cols: cols,
         url: ibisjGetContextUrl('/json/config/billing/zone')
      });

      zonePage.init();

   });

})(jQuery);

(function($) {

   function Report(name, option) {

      this.name = name;
      this.p = $.extend({
         $table: null,
         $trs: null,
         $selectedTr: null,
         $iconRecAdd: null,
         $iconRecEdit: null,
         $iconRecDelete: null,
         $form: null,
         $btnSave: null,
         $btnCancle: null
      }, option);

      /**
       * NOTE
       * To use validateForm function add class="ibisj-form-required" to all required fields.
       * Also requres lable for the fields id.
       * Currently P is only its parent.
       * @param $theForm
       */
      this.validateForm = function ($theForm) {
         var theResult = true;
         $('.ibisj-form-required', $theForm).each(function (i) {
            if ($(this).val().trim() === '') {
               theResult = false;
               $(this).parent('p').append('<div class="ui-state-error ui-corner-all" style="padding: 0pt 0.7em;">' +
                                          '<span class="ui-icon ui-icon-alert" style="float: left; margin-right: 0.3em;"></span>' +
                                          ' <strong>Alert:</strong> This Field can not be empty.</div>');
            }
         });
         return theResult;
      };

      this.selectTr = function ($tr) {

      };

   }

   ;

   /**
    * NOTE
    * To use form Init add class="ibisj-form-required" to all required fields.
    * Also requres lable for the fields id.
    * Currently P is only its parent.
    */
   Report.prototype.formInit = function () {

      var thisObj = this;

      var $theForm = this.p.$form;
      if ($theForm) {
         $('.ibisj-form-required', $theForm).each(function () {
            var $itsLable = $("label[for='" + $(this).attr('id') + "']", $(this).parent('p'));
            $("label[for='" + $(this).attr('id') +
              "']", $(this).parent('p')).append(' <span class="ibisj-required">*</span>');
         });

         $('#removePorts', $theForm).click(function() {
            return !$('#zonePorts option:selected').remove().appendTo('#allPorts');
         });
         $('#addPorts', $theForm).click(function() {
            return !$('#allPorts option:selected').remove().appendTo('#zonePorts');
         });

         $("#btnSave").click(function() {
            thisObj.saveZone();
         });

         $("#btnReset").click(function() {
            thisObj.clearZone();
         });

      }

      var $theTable = this.p.$table;
      if ($theTable) {
         $('.ibis-record', $theTable).livequery(function() {
            $(this).hover(function() {
               $(this).addClass('ibis-record-hover');
            }, function() {
               $(this).removeClass('ibis-record-hover');
            });
         });

         $('.ui-state-default', $theTable).livequery(function() {
            $(this).hover(function() {
               $(this).addClass('ui-state-hover');
            }, function() {
               $(this).removeClass('ui-state-hover');
            });
         });

         $('.ibis-record .ui-icon-pencil', $theTable).livequery("click", function() {
            $tr = $(this).parents('.ibis-record');
            thisObj.copyToForm($tr.get(0));
         });

         $('.ibis-record .ui-icon-minus', $theTable).livequery('click', function () {
            $tr = $(this).parents('.ibis-record');
            thisObj.deleteZone($('.zone-id', $tr).val(), $tr);
         });

         $('#btnZoneAdd', $theTable).click(function() {
            thisObj.createZone();
         });
      }
   };

   Report.prototype.clearZone = function() {
      $('.ibis-record.currentRecord').removeClass('currentRecord');

      $('#zoneId').val('0');
      $('#zoneName').val('');
      $('#zoneDescription').val('');
      $('#zoneClassOfService').val('');
      this.getPorts();
   };

   Report.prototype.copyToForm = function(t) {
      $t = $(t);
      $('.ibis-record.currentRecord').removeClass('currentRecord');
      $t.addClass('currentRecord');

      $('#zoneId').val($('.zone-id', $t).val());
      $('#zoneName').val($('.zone-name', $t).text());
      $('#zoneDescription').val($('.zone-description', $t).text());
      $('#zoneClassOfService').val($('.zone-classofservice', $t).text());
      this.getPorts();
      this.getZonePorts($('#zoneId').val());
   };

   Report.prototype.copyFormToRec = function() {
      var $trToUpdate = $('.currentRecord');
      var t = $trToUpdate.get(0);

      $('.zone-id', t).val($('#zoneId').val());
      $('.zone-name', t).text($('#zoneName').val());
      $('.zone-description', t).text($('#zoneDescription').val());
      $('.zone-classofservice', t).text($('#zoneClassOfService').val());
   };

   Report.prototype.saveZone = function (option) {

      if (!this.validateForm(this.p.$form)) {
         return false;
      }

      var option = {};
      var successfn;

      if (parseInt($('#zoneId').val()) > 0) {
         // Save
         option.type = 'POST';
         option.url = ibisjGetContextUrl('/json/config/billing/zone/' + $('#zoneId').val());
         option.successfn = function(msg) {
            if (msg.result) {
               alert('The Zone has been saved successfully');
               thisIt.copyFormToRec();
            }
         };
      } else {
         // New
         option.type = 'PUT';
         option.url = ibisjGetContextUrl('/json/config/billing/zone/add');
         option.successfn = function(data) {
            alert('The Zone has been created successfully');
            $('#zoneId').val(data.id);
            // Need to create TR
         };
      }

      var thisIt = this;

      var $ports = $('#zonePorts option');

      var thePorts = [];
      for (var i = 0; i < $ports.length; i++) {
         port = $ports.get(i);
         var $port = $(port);
         var theport = {
            id: parseInt($port.val())
         };
         thePorts.push(theport);
      }

      var theObj = {
         id: parseInt($('#zoneId').val()),
         name: $('#zoneName').val(),
         description: $('#zoneDescription').val(),
         classOfService: $('#zoneClassOfService').val(),
         ports: thePorts
      };

      var debug = JSON.stringify(theObj);


      option.errorfn = function (XMLHttpRequest, textStatus, errorThrown) {
         alert("The server has an error at the moment, Please, try again later!");
      };

      option.theObj = theObj;

      $.dcmi.ajaxApi.ajaxApiSave(option);

   };

   Report.prototype.getPorts = function() {

      var successfn = function(msg) {
         $('#allPorts').empty();
         for (var i = 0; i < msg.length; i++) {
            $('#allPorts').append('<option value="' + msg[i].id + '">' + msg[i].portNumber + '(' + msg[i].deviceName +
                                  ')' + '</option>');
         }
      };

      var errorfn = function (XMLHttpRequest, textStatus, errorThrown) {
         alert("The server has an error at the moment, Please, try again later!");
      }   ;

      var option = {
         successfn: successfn,
         errorfn: errorfn,
         url: ibisjGetContextUrl('/json/config/facilities/port')
      };

      $.dcmi.ajaxApi.ajaxApiGet(option);

   };

   Report.prototype.getZonePorts = function(zoneId) {

      var successfn = function(msg) {
         $('#zonePorts').empty();
         for (var i = 0; i < msg.ports.length; i++) {
            $('#zonePorts').append('<option value="' + msg.ports[i].id + '">' + msg.ports[i].portNumber + '(' +
                                   msg.ports[i].deviceName + ')' + '</option>')
            $("#allPorts option[value='" + msg.ports[i].id + "']").remove();
         }
      };

      var errorfn = function (XMLHttpRequest, textStatus, errorThrown) {
         alert("The server has an error at the moment, Please, try again later!");
      }   ;

      var option = {
         successfn: successfn,
         errorfn: errorfn,
         url: ibisjGetContextUrl('/json/config/billing/zone/' + zoneId)
      };

      $.dcmi.ajaxApi.ajaxApiGet(option);

   };

   Report.prototype.deleteZone = function(zoneId, $tr) {

      var thisIt = this

      var successfn = function(msg) {
         alert("The record has been deleted");
         if ($tr) {
            $tr.unbind();
            $tr.remove();
         }
         thisIt.clearZone();
      };

      var errorfn = function (XMLHttpRequest, textStatus, errorThrown) {
         alert("The server has an error at the moment, Please, try again later!");
      };

      var option = {
         successfn: successfn,
         errorfn: errorfn,
         url: ibisjGetContextUrl('/json/config/billing/zone/' + zoneId)
      };

      $.dcmi.ajaxApi.ajaxApiDelete(option);

   };


   var aReport;

   $(function() {

/*      aReport = new Report('zone', {
         $table: $('#tblZone'),
         $trs: $('#tblZone tr'),
         $iconRecAdd: $('#tblZone .ui-icon-circle-plus'),
         $iconRecEdit: $('#tblZone .ui-icon-pencil'),
         $iconRecDelete: $('#tblZone .ui-icon-minus'),
         $form: $('#frmZone'),
         $btnSave: $('#btnSave'),
         $btnCancle: $('#btnReset')
      });

      if (aReport.p.$form) {
         aReport.formInit();
      }*/
   });

   /**
    * Add javascript functions into the HTML page
    */
   $(document).ready(function() {

   });


})(jQuery);

