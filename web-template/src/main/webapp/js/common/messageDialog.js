var messageDialogBox;

function messageDialog(title, msg) {
   $("#messageDialog p").html(msg);
   messageDialogBox.dialog("option", "title", title);
   messageDialogBox.dialog("open");
}

$(function() {

   // Initialize error dialog

   messageDialogBox = $('<div id="messageDialog" style="display:none"><p></p></div>').dialog({
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
         Ok: function() {
            $(this).dialog('close');
         }
      }
   });
});