
## play it on browser
- open repository player web. e.g. https://10.22.111.73:8442/
- on player web log, find something like below.
2016-11-29 07:56:13,156 INFO  [http-nio-8442-exec-3] org.kurento.tcplayer.WebCallPlayerHandler (play(360)) - PLAY video of chatId qroom; 1 / 2 number of videos
2016-11-29 07:56:13,200 INFO  [http-nio-8442-exec-3] org.kurento.tcplayer.WebCallPlayerHandler (play(366)) - Recorded Video Found 0: id=578e5c71e4b0b6b015db8457, url=http://10.22.111.87:7676/repository_servlet/3nrbsuqo2psdi87jshdn1tc6eg
- copy id 578e5c71e4b0b6b015db8457
- and make query on prowser e.g. http://10.22.111.72:7676/repo/item/578e5c71e4b0b6b015db8457
- return with url to play archived media.
{"id":"578e5c71e4b0b6b015db8457","url":"http://10.22.111.72:7676/repository_servlet/rbv7ohf8h6misppadin24rmnrb"}
