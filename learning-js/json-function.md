


            /*
            [
            [ { funName: "fname1", arguments: [array ] } ],
            [ { funName: "fname1", arguments: [array ] }, { funName: "fname1", arguments: [array ] } ]
            ]
             */


            try {
                var objKey;
                for (objKey in custArgsObj) {
@@ -187,6 +194,8 @@ com.inq.addons.Salesforce = (function () {
 
            if (message === "exitChat") {
                endChat();
            } else if(message === "minimizeChat") {
                com.inq.flash.client.control.MinimizeManager.actionMinimize();
            }


liveagent.addCustomDetail("First Name", "Jane");

 [ { funName: "fname1", arguments: [array ] } ],
[ { funName: "addCustomDetail", arguments: [ "First Name", "Jane" ] } ],


liveagent.addCustomDetail("Case Subject", "Best snowboard for a beginner").doKnowledgeSearch();
  [ { funName: "fname1", arguments: [array ] }, { funName: "fname1", arguments: [array ] } ]

            <script type='text/javascript'>
/* Creates a custom detail called First Name and sets the value to "Jane" */
liveagent.addCustomDetail("First Name", "Jane");

/* Creates a custom detail called Last Name and sets the value to "Doe"  //janedoe@apple.com*/
liveagent.addCustomDetail("Last Name", "Doe");

/* Creates a custom detail called Phone Number and sets the value to "555-1212" */
liveagent.addCustomDetail("Phone Number", "415-555-1212");
liveagent.addCustomDetail("Contact Email", "janedoe@apple.com");

/* Creates a custom detail called Case Subject and sets the value to "Best snowboard for
a beginner" and will perform a knowledge search when the chat is accepted for the agent */

liveagent.addCustomDetail("Case Subject", "Best snowboard for a beginner").doKnowledgeSearch();

/* Creates a custom detail called Case Status and sets the value to "New" */
liveagent.addCustomDetail("Case Status", "New");
liveagent.addCustomDetail("Case Origin", "Chat");

/* This does a non-exact search on cases by the value of the "Case Subject" custom detail.
	If no results are found, it will create a case and set the case's subject and status
	The case that's found or created will be associated to the chat and the case will open in
	the Console for the agent when the chat is accepted */
liveagent.findOrCreate("Case").map("Subject","Case Subject",false,false,true).map("Status","Case Status",false,false,true).map("SuppliedName","First Name",false,false,true).map("SuppliedEmail","Contact Email",false,false,true).map("Origin","Case Origin",false,false,true).saveToTranscript("CaseId").showOnCreate();

/* This searches for a contact whose first and last name exactly match the values in the custom details for First and Last Name
	If no results are found, it will create a new contact and set it's first name, last name, and phone number to the values in the custom details */
liveagent.findOrCreate("Contact").map("FirstName","First Name",false,false,true).map("LastName","Last Name",false,false,true).map("Phone","Phone Number",false,false,true).map("Email","Contact Email",true,true,true);

/* The contact that's found or created will be saved or associated to the chat transcript.
The contact will be opened for the agent in the Console and the case is linked to the contact record */
liveagent.findOrCreate("Contact").saveToTranscript("ContactId").showOnCreate().linkToEntity("Case","ContactId");
</script>
<script type='text/javascript'>
/* Creates a custom detail called First Name and sets the value to "Jane" */
liveagent.addCustomDetail("First Name", "Jane");

/* Creates a custom detail called Last Name and sets the value to "Doe"  //janedoe@apple.com*/
liveagent.addCustomDetail("Last Name", "Doe");

/* Creates a custom detail called Phone Number and sets the value to "555-1212" */
liveagent.addCustomDetail("Phone Number", "415-555-1212");
liveagent.addCustomDetail("Contact Email", "janedoe@apple.com");

/* Creates a custom detail called Case Subject and sets the value to "Best snowboard for
a beginner" and will perform a knowledge search when the chat is accepted for the agent */

liveagent.addCustomDetail("Case Subject", "Best snowboard for a beginner").doKnowledgeSearch();

/* Creates a custom detail called Case Status and sets the value to "New" */
liveagent.addCustomDetail("Case Status", "New");
liveagent.addCustomDetail("Case Origin", "Chat");

/* This does a non-exact search on cases by the value of the "Case Subject" custom detail.
	If no results are found, it will create a case and set the case's subject and status
	The case that's found or created will be associated to the chat and the case will open in
	the Console for the agent when the chat is accepted */
liveagent.findOrCreate("Case").map("Subject","Case Subject",false,false,true).map("Status","Case Status",false,false,true).map("SuppliedName","First Name",false,false,true).map("SuppliedEmail","Contact Email",false,false,true).map("Origin","Case Origin",false,false,true).saveToTranscript("CaseId").showOnCreate();

/* This searches for a contact whose first and last name exactly match the values in the custom details for First and Last Name
	If no results are found, it will create a new contact and set it's first name, last name, and phone number to the values in the custom details */
liveagent.findOrCreate("Contact").map("FirstName","First Name",false,false,true).map("LastName","Last Name",false,false,true).map("Phone","Phone Number",false,false,true).map("Email","Contact Email",true,true,true);

/* The contact that's found or created will be saved or associated to the chat transcript.
The contact will be opened for the agent in the Console and the case is linked to the contact record */
liveagent.findOrCreate("Contact").saveToTranscript("ContactId").showOnCreate().linkToEntity("Case","ContactId");
</script>
