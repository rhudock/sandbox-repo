/**
 * \$Id\$
 * ports.js
 * Version: EBrusseau
 * Date: Nov 6, 2009  Time: 3:15:58 PM
 * Copyright (c) Nomadix 2009, All rights reserved.
 */


$(function() {

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
      //$("#portDetailDialog").find("#portType").replaceWith(PortTypeOptions.getSelectElement(portType));
      $detailDialog.find("#portDevice").val(aData[5]);
   };

   var buildObjFromForm = function () {

      var portTypeId = parseInt($('#portType option:selected').val());
      var portTypeName = $('#portType option:selected').text();
      var portType = { id: portTypeId, name: portTypeName };

      // "portNumber", "description", "locked", "portType", "deviceId", "deviceName"
      return theObj = {
         id: parseInt($('#portId').val()),
         portNumber: $('#portNumber').val(),
         description: $('#portDescription').val(),
         locked: $('#portLocked').attr('checked'),
         portType: portType,
         deviceId: parseInt($('#portDeviceId').val()),
         deviceName: $("#portDevice").val()
      };

   };

   var userInit = function () {

      var portTypeMgr = new ModelManager('portType');
      portTypeMgr.url = '/json/config/facilities/portType';
      portTypeMgr.getModels();

      if (portTypeMgr.result === true) {
         var portTypes = portTypeMgr.models;
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

   var portsPage = new IbisManagerView('port', {
      tableSelect: tableSelect,
      formDialogSelect: formDialogSelect,
      idSelect: idSelect,
      fnSetDetailFields: setDetailFields,
      fnBuildObjFromForm: buildObjFromForm,
      fnUserInit: userInit,
      fnBuildArrOfObj: buildArrOfObj,
      cols: cols,
      canCreate: false,
      noCreateMsg: 'Go to Devices View to create a new port',
      url: ibisjGetContextUrl('/json/config/facilities/ports')
   });

   portsPage.init();

});