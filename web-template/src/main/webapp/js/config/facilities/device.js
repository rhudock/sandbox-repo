// JavaScript Document

/**
 * \$Id\$
 * device.js
 * Version: DLee
 * Date: Oct 31, 2009  Time: 3:15:58 PM
 * Copyright (c) Nomadix 2009, All rights reserved.
 */

(function($) {
   $(function() {

      var tableSelect = "#tblDevice";
      var formDialogSelect = '#deviceDetailDialog';
      var idSelect = '#deviceId';
      // Sub View variables.
      var allPortTypes;
      var subViewPortsName = 'Ports';
      var portsPage;
      var portTable;

      var setDetailFields = function (aData) {
         if (!aData) {
            aData = ["-1", "", "", "", ""];
         }

         var $detailDialog = $(formDialogSelect);

         $detailDialog.find("#deviceId").val(aData[0]);
         $detailDialog.find("#deviceName").val(aData[1]);
         $detailDialog.find("#managementURI").val(aData[2]);
         $detailDialog.find("#deviceClass").val(aData[3]);

         populatePortTable($detailDialog);
      };

      var populatePortTable = function($mainDialog) {

         portTable.fnClearTable();

         var buildArrOfObj = function (o) {
            if (o) {
               return [o.id,  o.portNumber,  o.description, o.locked, o.portType.name ,o.deviceName, "" ];
            }
         };

         // Set the sub ports view.
         var theDeviceId = parseInt($mainDialog.find("#deviceId").val());
         var $btnPortsCreat = $('button#PortscreateRecord');

         if (theDeviceId > 0) {

            $btnPortsCreat.attr("disabled", false);

            $.dcmi.ajaxApi.ajaxApiGet({
               successfn: function(msg) {
                  for (var i = 0; i < msg.ports.length; i++) {
                     var index = portTable.fnAddData(buildArrOfObj(msg.ports[i]));
                     portsPage.setRowEventHandler(index[0]);
                  }
               },
               errorfn: function () {
                  alert("The server has an error at the moment, Please, try again later!");
               },
               url: ibisjGetContextUrl('/json/config/facilities/device/' + theDeviceId)
            });
         } else {
            $btnPortsCreat.attr("disabled", true);
         }

      };

      var userInit = function () {

         var $detailDialog = $(formDialogSelect);
         fnBuildPortSubTbl($detailDialog);

      };

      var fnBuildPortSubTbl = function($mainDialog) {

         var theDeviceId = parseInt($mainDialog.find("#deviceId").val());

         var tableSelect = "#tblPort";
         var formDialogSelect = '#portDetailDialog';
         var idSelect = '#portId';

         var setDetailFields = function (aData) {
            if (!aData) {
               aData = ["-1", "", "", false, "", ""];
            }

            var $detailDialog = $(formDialogSelect);

            $detailDialog.find("#portId").val(aData[0]);
            $detailDialog.find("#portNumber").val(aData[1]);
            $detailDialog.find("#portDescription").val(aData[2]);
            $detailDialog.find("#portLocked").attr('checked', ( aData[3] == 'true' ));

            $detailDialog.find("#portType").find('option').attr('selected', false);
            $detailDialog.find("#portType").find('option').each(function() {
               if (this.text === aData[4]) {
                  $(this).attr('selected', true);
               }
            });

            $detailDialog.find("#portDevice").val($mainDialog.find("#deviceName").val());
         };

         var buildObjFromForm = function () {

            var $detailDialog = $(formDialogSelect);

            var portTypeId = parseInt($('#portType option:selected').val());
            var portTypeName = $('#portType option:selected').text();
            var portType = { id: portTypeId, name: portTypeName };

            // "portNumber", "description", "locked", "portType", "deviceId", "deviceName"
            return theObj = {
               id: parseInt($('#portId', $detailDialog).val()),
               portNumber: $('#portNumber', $detailDialog).val(),
               description: $('#portDescription', $detailDialog).val(),
               locked: $('#portLocked', $detailDialog).attr('checked'),
               portType: portType,
               deviceId: parseInt($mainDialog.find("#deviceId").val()),
               deviceName: $mainDialog.find("#deviceName").val()
            };
         };

         var userInit = function () {

            var portTypeMgr = new ModelManager('portType');
            portTypeMgr.url = '/json/config/facilities/portType';
            portTypeMgr.getModels();

            if (portTypeMgr.result === true) {
               var portTypes = portTypeMgr.models;
               allPortTypes = portTypes;
               var $portTypeEl = $('#portDetailDialog').find('#portType');
               for (var i = 0; i < portTypes.length; i++) {
                  $portTypeEl.append('<option value="' + portTypes[i].id + '">' + portTypes[i].name + '</option>');
               }
            }
         };

         var buildArrOfObj = function (o) {
            if (o) {
               return [o.id,  o.portNumber,  o.description, o.locked, o.portType.name ,o.deviceName, "" ];
            }
         };

         var cols = [
            {
               bVisible: false
            },
            {
               sTitle: "Port Number",
               sWidth: "150px"
            },
            {
               sTitle: "Description"
            },
            {
               sTitle: "Locked"
            },
            {
               sTitle: "Port Type"
            },
            {
               sTitle: "Device"
            }
         ];

         portsPage = new IbisManagerView(subViewPortsName, {
            tableSelect: tableSelect,
            formDialogSelect: formDialogSelect,
            idSelect: idSelect,
            fnSetDetailFields: setDetailFields,
            fnBuildObjFromForm: buildObjFromForm,
            fnUserInit: userInit,
            fnBuildArrOfObj: buildArrOfObj,
            cols: cols,
            url: ibisjGetContextUrl('/json/config/facilities/ports')
         });

         portsPage.init();

         portTable = portsPage.getMainTable();

      };

      var buildObjFromForm = function () {

         var $detailDialog = $(formDialogSelect);
         var thePorts = [];

         var nodes = portTable.fnGetNodes();
         for (var x = 0; x < nodes.length; x++) {
            if (nodes[x] != null) {
               var portData = portTable.fnGetData(portTable.fnGetPosition(nodes[x]));

               var portTypeId;
               for (var i = 0; i < allPortTypes.length; i++) {
                  if (portData[4] === allPortTypes[i].name) {
                     portTypeId = allPortTypes[i].id;
                  }
               }

               var portType = { id: portTypeId, name: portData[4] };

               var theport = {
                  id: portData[0],
                  portNumber: portData[1],
                  description: portData[2],
                  locked: portData[3],
                  portType: portType,
                  deviceId: parseInt($('#deviceId', $detailDialog).val())
               };

               thePorts.push(theport);
            }
         }
         ;

         // "name", "managementURI", "deviceClass", "ports"
         return theObj = {
            id: parseInt($('#deviceId', $detailDialog).val()),
            name: $('#deviceName', $detailDialog).val(),
            managementURI: $('#managementURI', $detailDialog).val(),
            deviceClass: $('#deviceClass option:selected', $detailDialog).text(),
            ports: thePorts
         };

      };

      var buildArrOfObj = function (o) {
         if (o) {
            return [o.id,  o.name,  o.managementURI, o.deviceClass, "" ];
         }
      };

      var cols = [
         {
            bVisible: false
         },
         {
            sTitle: "Device Name",
            sWidth: "150px"
         },
         {
            sTitle: "Management URI"
         },
         {
            sTitle: "Device Class"
         }
      ];

      var devicePage = new IbisManagerView('Device', {
         tableSelect: tableSelect,
         formDialogSelect: formDialogSelect,
         idSelect: idSelect,
         fnSetDetailFields: setDetailFields,
         fnBuildObjFromForm: buildObjFromForm,
         fnBuildArrOfObj: buildArrOfObj,
         fnUserInit: userInit,
         cols: cols,
         formDialogSize: { height:450,  width: 700 },
         url: ibisjGetContextUrl('/json/config/facilities/device')
      });

      devicePage.init();

   });
})(jQuery);







