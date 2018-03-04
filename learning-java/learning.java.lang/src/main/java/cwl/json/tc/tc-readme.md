








#### Nina Response JSON
```
"TalkAgentResponse": {
    "@SCI": "@9eb0560a-026a-48d6-7cb7-78245b00a37b@7b34dddb-dbc9-42b7-9e62-96c8d48d8206",
    "@IID": "72945d46-0492-4b1b-b4af-64a3838ac618",
    "@TimeStamp": "2018-01-12T19:54:10.6958223Z",
    "@ResponseCode": "Found",
    "@Version": "6",
    "Display": {
        "OutText": {
            "#text": "Please tell me the type of latte you'd like: <ul><li><a href=\"#\" data-vtz-link-type=\"Dialog\" data-vtz-jump=\"877ac916-73fb-4d08-bca0-2b634493639f\">Targaryen Realness</a></li><li><a href=\"#\" data-vtz-link-type=\"Dialog\" data-vtz-jump=\"67cae494-c337-4c3b-83af-ecff42d6031b\">Three Eyed Raven</a></li><li><a href=\"#\" data-vtz-link-type=\"Dialog\" data-vtz-jump=\"428a288a-47bc-461a-90e1-c360fb331a32\">Lannister Gold</a></li></ul>"
        },
        "AlternateOutText": {
            "#text": "Select the search engine you'd like to use:"
        },
        "AlternateOutText2": {
            "#text": "Please tell me the type of latte you'd like: "
        }
    },
    "OutOptions": {
        "options": [
            "Yahoo",
            "Google"
        ]
    }
}
```







#### ABCListPicker JSON created
```

{
    "type": "interactive",
    "interactiveData": {
        "bid": "com.apple.messages.MSMessageExtensionBalloonPlugin:0000000000:com.apple.icloud.apps.messages.business.extension",
        "data": {
            "listPicker": {
                "multipleSelection": false,
                "sections": [
                    {
                        "items": [
                            {
                                "identifier": "1",
                                "order": 0,
                                "style": "default",
                                "title": "Yahoo"
                            },
                            {
                                "identifier": "2",
                                "order": 1,
                                "style": "default",
                                "title": "Google"
                            }
                        ],
                        "order": 0,
                        "title": "Select:"
                    }
                ]
            },
            "mspVersion": "1.0",
            "requestIdentifier": "da39a3ee5e6b4b0d3255bfef95601890afd80709"
        },
        "receivedMessage": {
            "imageIdentifier": "1",
            "style": "small",
            "title": "Select the search engine you'd like to use:"
        },
        "replyMessage": {
           "style": "small",
            "title": "Selected:",
            "subtitle": ""
        }
    }
}
```
