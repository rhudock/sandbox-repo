

START With API

logs have pattern.


1. Read File.
2. Read log detect log patterns and sequence


Conversation id            - Status
Chat id / Engagement id,   - Status
Gateway / Business Contact Id
Customer id/ Customer Contact Id
Message id,


-[Pattern API](https://docs.oracle.com/javase/6/docs/api/java/util/regex/Pattern.html)
-[JavaRegularExpressions](http://www.vogella.com/tutorials/JavaRegularExpressions/article.html)

[com.inq.api.plugins.smschat.ConversationManagerImpl] - <Found no conversation, creating new conversation [-4309282124953878381] with customer [IMessageConnection{user=AQAAY2nzJ3iXaDPIWk3J2duxUJKRFguTM4YKbZ7J1c3iBxgS59ccDnj25mFO6l4GDJ2sPBsz9ZecFyvZXO1s5lERHesOzxLAohA7JftLCRgl1Ejb14XFTZFDHuN1v17xxADkcZ2d/bIAfPZoa2eXjIV9gdul9Ng_, endpoint=656c19b3-be94-11e7-847d-7b88b04daa8e||, gateway_name=APPLE_BUSINESS_CHAT}]: conversationTimeout [129600], initial SmsChatTemplate[smsChatTemplateId=33, siteId=10006005, agentGroupId=10006007, businessUnitId=19001105, stopKeyword=no_keyword, scriptTreeId=12201177, virtualAssistantId=null, smsDeliveryTimeoutSeconds=null]>

### My Grep Note
* TC Developer's Tip *
=====================================================
How to search production log
=====================================================
Log is located at:  
/home/prod_logs/productionlogs

Each clustered service has its own folder.
Some abbribiations are;
ab - east cost
el - west cost

eg. Chat Router (CR) West Cost
elchatrouter01

Two types of log files are;
java log
access log
/access.log.20121217*
/jvm-elv3ar??.log.20121120*

=====================================================
How to search production log Advanced regexp
=====================================================
http://www.robelle.com/smugbook/regexpr.html

Note:

escape for |  [ ]
zcat /home/logs/productionlogs/elvts??/jvm-elv3ts??.log.20131120*.gz | grep '736992254474543153\|736992254447474667'
zgrep 'ERROR \[com.inq.api.plugins.smschat.SmsChatManager\] - <Conversation' /home/prod_logs/productionlogs/lax1vapi*/jvm-*.log.201802*.gz
zgrep 'APPLE' /home/prod_logs/productionlogs/lax1vapi*/jvm-*.log.20180307*.gz

no escape for . *
zcat /home/logs/productionlogs/elvts??/jvm-elv3ts??.log.20131120*.gz | grep 'NEW CHAT.*TG-O-R-G-Marketing-DTM-C2C-Test_W_131007y_A'

zcat /home/prod_logs/productionlogs/abvcb??/jvm-*.log.201403*.gz  | grep 724889414236110781
> ~/file_name.log
=====================================================


How to search production log Advanced - Options
=====================================================
https://www.digitalocean.com/community/tutorials/using-grep-regular-expressions-to-search-for-text-patterns-in-linux
=====================================================

Examples

zgrep "chat\.agentSentCobrowseInvite\|chat\.agentSentSharedControlInvite\|chat\.cobrowseStarted\|chat\.cobrowseDeclined\|chat\.cobrowseSharedControlStarted\|chat\.cobrowseSharedControlDeclined\|chat\.customerEndedCobrowse\|chat\.agentEndedCobrowse" /home/prod_logs/productionlogs/elvts??/jvm-elv3ts??.log.20160415*.gz  > ~/log/cob20160415.log
zgrep "chat\.agentSentCobrowseInvite\|chat\.agentSentSharedControlInvite\|chat\.cobrowseStarted\|chat\.cobrowseDeclined\|chat\.cobrowseSharedControlStarted\|chat\.cobrowseSharedControlDeclined\|chat\.customerEndedCobrowse\|chat\.agentEndedCobrowse" /home/prod_logs/productionlogs/elvcr??/jvm-elv3cr??.log.20160415*.gz  > ~/log/cob20160415.log

zgrep 'get response from the Virtual Agent service'  /home/prod_logs/productionlogs/*cr*/jvm-chatrouter??.log.201802*.gz
zgrep 'Unable to resolve Nina service exchange'  /home/prod_logs/productionlogs/*cr*/jvm-*.log.201802*.gz > ~/log/nina.timeoute.log

** successful
zgrep 745440779888743303 /home/prod_logs/productionlogs/??vcb??/jvm-*.log.20151216*.gz > ~/log/745440779888743303.log
zgrep "Queued message" /home/prod_logs/productionlogs/??vcb??/jvm-*.log.20151216*.gz
zgrep "aiError" /home/prod_logs/productionlogs/??vcb??/jvm-*.log.20151216*.gz

zgrep 745722259007591275 /home/prod_logs/productionlogs/??vcr??/jvm-*.log.20151216*.gz > ~/log/cr745722259007591275.log

zgrep 724330156596915448 /home/prod_logs/productionlogs/elvcb??/jvm-*.log.20151215*.gz
zgrep 744596359089839570 /home/prod_logs/productionlogs/elvcb??/jvm-*.log.20151215*.gz
zgrep 744033409142530340 /home/prod_logs/productionlogs/elvcb??/jvm-*.log.20151215*.gz
zgrep chatId= /home/prod_logs/productionlogs/elvcb??/jvm-*.log.20151215*.gz


zgrep 733333785588493025 /home/prod_logs/productionlogs/abvcb??/jvm-*.log.201403*.gz > ~/log/cob733333785588493025a.log
  959  zgrep 724889414236110781 /home/prod_logs/productionlogs/abvcb??/jvm-*.log.201403*.gz > ~/log/724889414236110781a.log
  960  zgrep 724044995600518991 /home/prod_logs/productionlogs/abvcb??/jvm-*.log.201403*.gz > ~/log/724044995600518991.log
  961  zgrep 731926407577306993 /home/prod_logs/productionlogs/abvcb??/jvm-*.log.201403*.gz > ~/log/731926407577306993.log
  962  zgrep 732207882431634225 /home/prod_logs/productionlogs/abvcb??/jvm-*.log.20140324.gz > ~/log/732207882431634225.log
  963  zgrep 731926407577306993 /home/prod_logs/productionlogs/abvcb??/jvm-*.log.20140324*.gz > ~/log/731926407577306993.log
  964  zgrep 732207882431634225 /home/prod_logs/productionlogs/abvcb??/jvm-*.log.20140324*.gz > ~/log/732207882431634225.log
  965  zgrep 731926407577306993 /home/prod_logs/productionlogs/abvcb??/jvm-*.log.2014032*.gz > ~/log/731926407577306993.log
  966  zgrep 732207882431634225 /home/prod_logs/productionlogs/abvcb??/jvm-*.log.2014032*.gz > ~/log/732207882431634225.log
  967  zgrep 732207894153394730 /home/prod_logs/productionlogs/abvcb??/jvm-*.log.2014032*.gz > ~/log/732207894153394730.log
  968  zgrep 732207093648682635 /home/prod_logs/productionlogs/abvcb??/jvm-*.log.2013110*.gz > ~/log/732207093648682635.log


zgrep 732489497657461964 abvcb??/jvm-*.log.20140418*.gz > ~/log/732489497657461964.log

zgrep 732489497657461964 abvcb??/access-*.log.20140418*.gz >> ~/log/732489497657461964.log

zgrep 741778173773032417 elvcb??/jvm-*.log.20140418*.gz > ~/log/741778173773032417.log

zgrep 741778173773032417 elvcb??/access-*.log.20140418*.gz >> ~/log/741778173773032417.log

zgrep 732208590082156075 /home/prod_logs/productionlogs/abvcb??/jvm-*.log.201403*.gz > ~/log/cob733333785588493025a.log
zgrep 732208590082156075 /home/prod_logs/productionlogs/elvts??/jvm-*.log.20140727*.gz > ~/log/732208590082156075.log
zcat /home/logs/productionlogs/elvts??/jvm-elv3ts??.log.20131120*.gz | grep "unknown_device_type"

zgrep 732208590082156075 /home/prod_logs/productionlogs/abv*/*20140727*.gz > ~/log/732208590082156075.log
zgrep 732205859665238057 /home/prod_logs/productionlogs/abv*/*20140727*.gz > ~/log/732205859665238057.log
zgrep 732771540155543468 /home/prod_logs/productionlogs/abv*/*20140727*.gz > ~/log/732771540155543468.log
zgrep 732208590700158915 /home/prod_logs/productionlogs/abv*/*20140727*.gz > ~/log/732208590700158915.log
zgrep 733053015350157320 /home/prod_logs/productionlogs/abv*/*20140727*.gz > ~/log/733053015350157320.log
zgrep 732490058841692026 /home/prod_logs/productionlogs/abv*/*20140727*.gz > ~/log/732490058841692026.log

zgrep "customerResponded.*6967615223267035514" /home/prod_logs/productionlogs/lax1vts*/jvm-lax1v3ts*.log.20161206*

zgrep "customerResponded.*6967615223267035514" /home/prod_logs/productionlogs/lax1vts*/jvm-lax1v3ts*.log.20161206*

lax1vts114

zgrep 745437915480550266 /home/prod_logs/productionlogs/abv*/*20140727*.gz > ~/log/745437915480550266.log
zgrep 743186109579332014 /home/prod_logs/productionlogs/abv*/*20140727*.gz > ~/log/743186109579332014.log

zgrep SEQ /home/prod_logs/productionlogs/abvcb*/jvm-*.log.20140727*.gz > ~/log/SEQ.log

zgrep HttpCobrowseController /home/prod_logs/productionlogs/abv*/*20140727*.gz > ~/log/HttpCobrowseController.log

zgrep 733053015350157320 /home/prod_logs/productionlogs/abv????/jvm-*.log.20140727*.gz > ~/log/733053015350157320.log

zgrep 732208590082156075 /home/prod_logs/productionlogs/abvcb*/jvm-*.log.2014072*.gz >> ~/log/732208590082156075.log

zgrep chat.cobrowseStarted /home/prod_logs/productionlogs/abvcr*/*2014072*.gz
zgrep chat.cobrowseDeclined /home/prod_logs/productionlogs/abvcr*/*2014072*.gz
zgrep event.agent_last_name /home/prod_logs/productionlogs/abvcr*/*2014072*.gz

zgrep 736994117796735861 /home/prod_logs/productionlogs/elvcr*/access.log.20141015*.gz >> ~/log/736994117796735861.log

zgrep -5065608496762339946 /home/prod_logs/productionlogs/elvcr*/access.log.20141015*.gz >> ~/log/-5065608496762339946.log

-- -5065608496762339946 case
zgrep -5065608496762339946 /home/prod_logs/productionlogs/abvapi*/access-*.log.2016092*.gz >> ~/log/-5065608496762339946.log

zgrep 10006092 /home/prod_logs/productionlogs/*api*/jvm-*.log.20180412*.gz


zgrep PageMarker /home/prod_logs/productionlogs/lax1vapi*/jvm-*.log.20180412*.gz




zgrep Paul /home/prod_logs/productionlogs/*api*/access-*.log.2018011**.gz >> ~/log/-5065608496762339946.log

zgrep 'b5d62512-e736-11e7-a671-5153c620923d' /home/prod_logs/productionlogs/elvapi*/jvm-elv*.log.201802*.gz >> ~/log/bb2abc.log

zgrep event.agent_last_name /home/prod_logs/productionlogs/abvcr*/*2014072*.gz

zgrep HttpCobrowseController /home/prod_logs/productionlogs/??vcb*/*2014072*.gz

zgrep 732208590082156075 /home/prod_logs/productionlogs/elvts??/jvm-*.log.20140727*.gz > ~/log/732208590082156075.log

zgrep 733333785588493025 /home/prod_logs/productionlogs/*portal*/access.log.log.201403*.gz

zgrep engagementID=4302160089878553096 /home/prod_logs/productionlogs/elvapi01
zgrep '[-[:digit:]]{19}' access-elv3api01.log.20160828*.gz 
zgrep 'engagementID=[-[:digit:]]{10}' access-elv3api01.log.20160828*.gz 
> {10} doesn't work in zgrep

-o only matching.
zgrep -o 'engagementID=[-[:digit:]]*' access-elv3api01.log.20160828*.gz 
zgrep -o 'engagementID=[-[:digit:]]*' access-elv3api01.log.20160828*.gz | sort | uniq

zgrep -o 'timeout' access-elv3api01.log.20160828*.gz
zgrep -o 'closed by timeout [[:digit:]]* ms, chatID=[-[:digit:]]*' access-elv3api01.log.20160828*.gz

engagementID=

sort

uniq


--

732489497657461964
=====================================================
Using username "dlee"                                                                                         .
Authenticating with public key "imported-openssh-key"
Passphrase for key "imported-openssh-key":
Last login: Wed Jan  9 19:12:13 2013 from 172.26.111.137
[dlee@agvdevtest03 ~]$ sudo -s
[root@agvdevtest03 dlee]# su hudson
[hudson@agvdevtest03 dlee]$ ssh agvdemo07
^C
[hudson@agvdevtest03 dlee]$ ssh agvdemo04
The authenticity of host 'agvdemo04 (172.26.101.90)' can't be established.
RSA key fingerprint is df:79:e1:20:23:51:f0:73:78:9d:f0:6a:e1:7e:e7:73.
Are you sure you want to continue connecting (yes/no)?



--

zcat and grep is used to search log.

# Search 742339887750838273 in java log by all west cost CR service cluster on 2013 Sep. 16th
zcat /home/prod_logs/productionlogs/elvcr*/jvm-chatrouter??.log.20130916*.gz  | grep 742339887750838273


# Search given chat id in Chatrouter log files.
zcat /home/prod_logs/productionlogs/elvcr*/jvm-*.log.20130916*.gz  | grep 742339887750838273


# Same search, save the result into a new file into your home folder
zcat /home/prod_logs/productionlogs/elvcr*/jvm-*.log.20130916*.gz  | grep 742339887750838273 > ~/file_name.log



**NOTE** el + long name (e.g. tagserver) is not used any more and only keep old logs


* TS log contains
Event e.g. conversionFunnel\.eligible



# using OR
zcat ../logs/productionlogs/eltagserver??/jvm-tagserver??.log.20120416* | grep "755003352778421100\|755003352776901038" > INVEST-661/surveyErrorCollected20120417_755003352778421100.log

# using wild card
zcat ../logs/productionlogs/eltagserver??/jvm-tagserver??.log.20120312* | grep survey\.*siteID=154

Note what . is
zcat ../logs/productionlogs/eltagserver??/jvm-tagserver??.log.20120213* | grep conversionFunnel\.conversion



zcat ../logs/productionlogs/eltagserver??/jvm-tagserver??.log.20120416* | grep -B 1 "undefined.*203818" > INVEST-661/surveyErrorCollected20120417_755003352778421100_sub.log



Site id 141 is Broadband National - Bridgevine but I cannot find any access log 
zcat /home/logs/productionlogs/elvts??/access.log.20120926* | grep siteID=141\.*
--

/home/logs/productionlogs/elvts??/jvm-elv3ts??.log.20131120*.gz 
/home/logs/productionlogs/elvcr??/jvm-elv3cr??.log.20131020*.gz
/home/logs/productionlogs/elvar??/jvm-elv3ar??.log.20121120*

zcat /home/prod_logs/productionlogs/abvcb??/jvm-*.log.201403*.gz  | grep 724889414236110781
> ~/file_name.log

zcat /home/logs/productionlogs/elvts??/jvm-elv3ts??.log.20140303*.gz | grep 724889414236110781

zcat /home/logs/productionlogs/??v????/jvm-??v3????.log.20140303*.gz | grep 724889414236110781

zcat /home/logs/productionlogs/elvts??/jvm-elv3ts??.log.20131120*.gz | grep "unknown_device_type"

zcat /home/logs/productionlogs/elvcr??/jvm-elv3cr??.log.20131120*.gz | grep "unknown"
zcat /home/logs/productionlogs/abvcr??/jvm-abv3cr??.log.20170301*.gz | grep "call.requested"

zcat /home/prod_logs/productionlogs/elvcb??/jvm-*.log.20151215*.gz | grep "10004119"

zgrep 724330156513745420 /home/prod_logs/productionlogs/??vcb??/jvm-*.log.20151216*.gz | grep "starts listening to cobrowse"
/home/prod_logs/productionlogs/abvcb02/jvm-abv3cb02.log.20151216.0758.gz:2015-12-15 13:17:08,695 INFO [com.inq.cobrowse.service.agent.AgentChatJoinService.handleJoin] - <Agent [eb935k] at [112.199.88.38] starts listening to cobrowse [chatId=724330156513745420]>
1.45019E+12	27:18.6	2015-12-15 13:27:18,605 INFO [com.inq.cobrowse.service.customer.cobrowse.CobrowseServiceImpl.cobrowse] - <cob.clientMsgSent?APG=true&SEQ=1&cid=724330156513745420&wid=122947649&data=<CW></CW>>	abvcb02	191	abvcb02	AB_appliation_logs	abvcb02.touchcommerce.com	/usr/inq/abv3cb02/logs/jvm-abv3cb02.log

zgrep 724330156513745420 /home/prod_logs/productionlogs/??vcb??/jvm-*.log.20151216*.gz | grep "cob.clientMsgSent?APG=true&SEQ=1&cid=724330156513745420&wid=122947649&data=<CW></CW>"
zgrep 724330156513745420 /home/prod_logs/productionlogs/??vcb??/jvm-*.log.20151216*.gz > ~/log/724330156513745420.log
zgrep 724330156596915448 /home/prod_logs/productionlogs/??vcb??/jvm-*.log.20151216*.gz > ~/log/724330156596915448.log
zgrep 745722259007591275 /home/prod_logs/productionlogs/??vcb??/jvm-*.log.20151216*.gz > ~/log/745722259007591275.log

zcat /home/prod_logs/productionlogs/eltagserver??/jvm-tagserver??.log.20160416* | grep "755003352778421100\|755003352776901038" > INVEST-661/surveyErrorCollected20120417_755003352778421100.log

zgrep "chat\.agentSentCobrowseInvite" /home/prod_logs/productionlogs/elvts??/jvm-elv3ts??.log.20160415*.gz