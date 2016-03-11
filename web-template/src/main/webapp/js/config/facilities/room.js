// JavaScript Document

/**
 * \$Id: room.js 65 2009-04-03 19:07:30Z daniel.lee $
 * userManager.js
 * Version: DLee
 * Date: Sep 31, 2009  Time: 3:15:58 PM
 * Copyright (c) Nomadix 2009, All rights reserved.
 */

(function($) {

   $(function() {

      var tableSelect = "#tblRoom";
      var formDialogSelect = '#roomDetailDialog';
      var idSelect = '#roomId';

      var setDetailFields = function (aData) {
         if (!aData) {
            aData = ["-1", "", "", "false"];
         }

         var $detailDialog = $(formDialogSelect);

         $detailDialog.find("#roomId").val(aData[0]);
         $detailDialog.find("#roomName").val(aData[1]);
         $detailDialog.find("#roomDescription").val(aData[2]);
         $detailDialog.find("#roomOccupied").val(aData[3]);

         // populates free ports.
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
            url: ibisjGetContextUrl('/json/config/facilities/ports/free')
         });

         // populates room ports.
         $detailDialog.find('#roomPorts').empty();
         if (parseInt(aData[0]) > 0) {
            $.dcmi.ajaxApi.ajaxApiGet({
               successfn: function(msg) {
                  for (var i = 0; i < msg.ports.length; i++) {
                     $detailDialog.find('#roomPorts').append('<option value="' + msg.ports[i].id + '">' +
                                                             msg.ports[i].portNumber + '(' + msg.ports[i].deviceName +
                                                             ')' + '</option>');
                     $("#allPorts option[value='" + msg.ports[i].id + "']").remove();
                  }
               },
               errorfn: function () {
                  alert("The server has an error at the moment, Please, try again later!");
               },
               url: ibisjGetContextUrl('/json/config/facilities/room/' + aData[0])
            });
         }

         $detailDialog.find('#removePorts').click(function() {
            return !$detailDialog.find('#roomPorts option:selected').remove().appendTo('#allPorts');
         });
         $detailDialog.find('#addPorts').click(function() {
            return !$detailDialog.find('#allPorts option:selected').remove().appendTo('#roomPorts');
         });

      };

      var buildObjFromForm = function () {

         var $detailDialog = $(formDialogSelect);

         var $ports = $('#roomPorts option', $detailDialog);

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
            id: parseInt($('#roomId', $detailDialog).val()),
            name: $('#roomName', $detailDialog).val(),
            description: $('#roomDescription', $detailDialog).val(),
            occupied: $('#roomOccupied', $detailDialog).val(),
            ports: thePorts
         };

      };

      var userInit = function () {
         // Additional build in dialog.

      };

      var buildArrOfObj = function (o) {
         if (o) {
            return [o.id,  o.name,  o.description, o.occupied, "" ];
         }
      };

      var cols = [
         {
            bVisible: false
         },
         {
            sTitle: "Room Number",
            sWidth: "150px"
         },
         {
            sTitle: "Description"
         },
         {
            sTitle: "Occupied"
         }
      ];

      var roomPage = new IbisManagerView('Room', {
         tableSelect: tableSelect,
         formDialogSelect: formDialogSelect,
         idSelect: idSelect,
         fnSetDetailFields: setDetailFields,
         fnBuildObjFromForm: buildObjFromForm,
         fnUserInit: userInit,
         fnBuildArrOfObj: buildArrOfObj,
         cols: cols,
         url: ibisjGetContextUrl('/json/config/facilities/room')
      });

      roomPage.init();

   });

})(jQuery);


