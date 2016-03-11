// JavaScript Document

/**
 * \$Id: room.js 65 2009-04-03 19:07:30Z daniel.lee $
 * userManager.js
 * Version: DLee
 * Date: Sep 31, 2009  Time: 3:15:58 PM
 * Copyright (c) Nomadix 2009, All rights reserved.
 */

//  "name", "mapped", "billableRoom", "vroomType"

(function($) {

   $(function() {

      var tableSelect = "#tblVroom";
      var formDialogSelect = '#vroomDetailDialog';
      var idSelect = '#vroomId';

      var setDetailFields = function (aData) {
         if (!aData) {
            aData = ["-1", "", "0", "0"];
         }

         var $detailDialog = $(formDialogSelect);

         $detailDialog.find("#vroomId").val(aData[0]);
         $detailDialog.find("#vroomName").val(aData[1]);
         $detailDialog.find("#vroomMapped").val(aData[2]);
         $detailDialog.find("#vroomBillableRoom").val(aData[3]);

      };

      var buildObjFromForm = function () {

         var $detailDialog = $(formDialogSelect);

         return theObj = {
            id: parseInt($('#vroomId', $detailDialog).val()),
            name: $('#vroomName', $detailDialog).val(),
            mapped: $('#vroomMapped', $detailDialog).val(),
            billableRoom: $('#vroomBillableRoom', $detailDialog).val()
         };

      };

      var userInit = function () {
         // Additional build in dialog.

      };

      var buildArrOfObj = function (o) {
         if (o) {
            return [o.id,  o.name,  o.mapped, o.billableRoom, "" ];
         }
      };

      var cols = [
         {
            bVisible: false
         },
         {
            sTitle: "VRoom Number",
            sWidth: "150px"
         },
         {
            sTitle: "Mapped"
         },
         {
            sTitle: "Billable Room"
         }
      ];

      var vroomPage = new IbisManagerView('VRoom', {
         tableSelect: tableSelect,
         formDialogSelect: formDialogSelect,
         idSelect: idSelect,
         fnSetDetailFields: setDetailFields,
         fnBuildObjFromForm: buildObjFromForm,
         fnUserInit: userInit,
         fnBuildArrOfObj: buildArrOfObj,
         cols: cols,
         canCreate: false,
         noCreateMsg: 'Under construction. Please, Visit again soon!',
         url: ibisjGetContextUrl('/json/config/facilities/vroom')
      });

      vroomPage.init();

   });

})(jQuery);


