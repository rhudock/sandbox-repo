

var input = {
   "@SCI": "",
   "@IID": "userIdentifier",
   "@TimeStamp": "2017-10-24T15:16:50.698407+11:00",
   "UserText": "userText",
   "NleResults": true,
   "NinaVars": {
      "assetType": "assetType",
      "invocationpoint": "invocationPoint"
   }
};

console.log("Nuance JSON Object");
console.log(input);

   // Wrap with TalkAgentRequest

var talkRequest = {
   "TalkAgentRequest": input
}

console.log("Wrapped TalkRequest JSON Object");
console.log(talkRequest);

var jsonString = JSON.stringify(talkRequest);
console.log("JSON String");
console.log(jsonString);
