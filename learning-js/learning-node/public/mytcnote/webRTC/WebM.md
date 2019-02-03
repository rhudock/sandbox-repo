
## webm audio detail

WebM Wiki https://en.wikipedia.org/wiki/WebM
Opus Wiki https://en.wikipedia.org/wiki/Opus_(audio_format)


1) We need a copy of a sample audio file 
> Sample file has been Attached 

2) What format?  webm   Codec name for audio files? Opus?
> file format is webm and codec is opus

3) Narrow band or wide band?  Above or below 16khz?  48k?  varies based on available bandwith?
> webRTC default is Full Band with 48K 
a=rtpmap:101 opus/48000/2 (rfc7587#section-7)

4) Stereo or mono?  mono?  The audio for agent and customer is merged into a single mono file
> default uses 2 channels (see answer 3) 

5) How are we notified of changes in bandwith, if at all?
> This question will be answered as we have better experience and knowledge.


WebM Project Home http://www.webmproject.org/
Opus MDN presentation https://www.opus-codec.org/static/presentations/opus_ccbe2013.pdf
Opus Interactive Audio Codec Home Page http://opus-codec.org/
rfc7587 https://tools.ietf.org/html/rfc7587#section-7
    http://stackoverflow.com/questions/32473078/webrtc-how-to-tell-opus-codec-to-use-super-wide-band-full-band

Google Group Kurento https://groups.google.com/forum/#!forum/kurento



5) How are we notified of changes in bandwith, if at all?
> This question will be answered as we have better experience and knowledge.


Opus supports bitrates from 6kbps to 510kbps for typical stereo audio sources (and a maximum of around 255 kbps per channel for multichannel audio), with the 'sweet spot' for music and general audio around 30kbps (mono) and 40-100 kbps (stereo). It is intrinsically variable bitrate.


Opus supports "instigate codec switching" to provide better audio experience during WebRTC Call where real time is most important.

Opus is able to seamlessly adapt its mode of operation without glitches or sound interruption which can be particularly useful for mixed-content audio or varying network conditions.
Regarding "instigate codec switching", the switching includes the choice of mono, stereo and other channel mappings, the use of the speech-oriented SILK layer, the general-purpose CELT layer or the hybrid of both, and the use of different audio bandwidths (4kHz, 6kHz, 8kHz, 12kHz, 20kHz) as well as the quality adjustments within the same operating mode.
(http://wiki.hydrogenaud.io/index.php?title=Opus)

In javascript, Latency can be detected as jitter in each stream. No further information was detected regarding to audio quality which I believe browsers (WebRTC Application) automatically adopts audio encoding rate for best quality all the time. (https://www.quora.com/Can-you-adjust-WebRTC-for-bandwidth-quality) says that selected wideband audio codec (Opus) can dynamically change bandwidth/quality during a call to make the best of the network it has.

Opus examples http://opus-codec.org/examples/#gauge



http://wiki.hydrogenaud.io/index.php?title=Opus
> instigate codec switching  - https://www.google.com/patents/US20150332677

Fundamentals of Voice-Quality Engineering in Wireless Networks https://books.google.com/books?id=CJWE5KP044gC&pg=PA68&lpg=PA68&dq=instigate+codec+switching&source=bl&ots=3xfkNAzNke&sig=4MUX6croR3fkRK__RY025BvV21A&hl=en&sa=X&ved=0ahUKEwjTn_S1nM_QAhWDCywKHRkmADcQ6AEIQTAG#v=onepage&q=instigate%20codec%20switching&f=false

What's the average latency of a WebRTC audio in a chat? https://www.quora.com/Whats-the-average-latency-of-a-WebRTC-audio-in-a-chat
> Latency depends on a lot of parameters, so it is hard to tell. The main parameter ends up being the network connection and the topography of the network.
WebRTC tries to get the latency to the lowest possible - similar to how other VoIP protocols and services do it.
Expect to have latency that is less than 500 milliseconds most times, which should be good for your use case.
> Latency Depends on lots of factor Specially depends on the network connection or WebRTC audio calls traffic through media gateway. though Their is very minimal latency for audio calls but you can expect latency of less than 500 milliseconds.

You can check latency in your browser where you can find all the details about transferred audio packets and successful and lost audio packets.

Can you adjust WebRTC for bandwidth quality? https://www.quora.com/Can-you-adjust-WebRTC-for-bandwidth-quality
>  selected wideband audio codec (Opus) can dynamically change bandwidth/quality during a call to make the best of the network it has.
http://w3c.github.io/webrtc-pc/#mediatracksupportedconstraints-mediatrackcapabilities-mediatrackconstraints-and-mediatracksettings



http://stackoverflow.com/questions/21407043/webrtc-remove-reduce-latency-between-devices-that-are-sharing-their-videos-str
Latency is a function of the number of steps on the path between the source (microphone, camera) and the output (speakers, screen).

Changing clocks will have zero impact on latency.

The delays you have include:

device internal delays - waiting for screen vsync, etc...; nothing much to be done here
device interface delays - a shorter cable will save you some time, but nothing measureable
software delays - your operating system and browser; you might be able to do something here, but you probably don't want to, trust that your browser maker is doing what they can
encoding delays - a faster processor helps a little here, but the biggest concern is for things like audio, the encoder has to wait for a certain amount of audio to accumulate before it can even start encoding; by default, this is 20ms, so not much; eventually, you will be able to request shorter ptimes (what the control is called) for Opus, but it's early days yet
decoding delays - again, a faster processor helps a little, but there's not much to be done
jitter buffer delay - audio in particular requires a little bit of extra delay at a receiver so that any network jitter (fluctuations in the rate at which packets are delivered) doesn't cause gaps in audio; this is usually outside of your control, but that doesn't mean that it's completely impossible
resynchronization delays - when you are playing synchronized audio and video, if one gets delayed for any reason, playback of the other might be delayed so that the two can be played out together; this should be fairly small, and is likely outside of your control
network delays - this is where you can help, probably a lot, depending on your network configuration
You can't change the physics of the situation when it comes to the distance between two peers, but there are a lot of network characteristics that can change the actual latency:

direct path - if, for any reason, you are using a relay server, then your latency will suffer, potentially a lot, because every packet doesn't travel directly, it takes a detour via the relay server
size of pipe - trying to cram high resolution video down a small pipe can work, but getting big intra-frames down a tiny pipe can add some extra delays
TCP - if UDP is disabled, falling back to TCP can have a pretty dire impact on latency, mainly due to a special exposure to packet loss, which requires retransmissions and causes subsequent packets to be delayed until the retransmission completes (this is called head of line blocking); this can also happen in certain perverse NAT scenarios, even if UDP is enabled in theory, though most likely this will result in a relay server being used
larger network issues - maybe your peers are on different ISPs and those ISPs have poor peering arrangements, so that packets take a suboptimal route between peers; traceroute might help you identify where things are going
congestion - maybe you have some congestion on the network; congestion tends to cause additional delay, particularly when it is caused by TCP, because TCP tends to fill up tail-drop queues in routers, forcing your packets to wait extra time; you might also be causing self-congestion if you are using data channels, the congestion control algorithm there is the same one that TCP uses by default, which is bad for real-time latency
I'm sure that's not a complete taxonomy, but this should give you a start.