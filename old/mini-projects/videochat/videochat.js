function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Get URL variables
var urlVariables = [];

// Compatibility
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
var RTCPeerConnection = RTCPeerConnection || webkitRTCPeerConnection || mozRTCPeerConnection;

var selfView = $('#self-view');
var otherView = $('#other-view');

if (!navigator.getUserMedia)
	alert('Your browser does not appear to be WebRTC-capable.');

// Connect your webcam to the self view
navigator.getUserMedia({audio: false, video: true}, function(mediaStream) {
	selfView[0].src = window.URL.createObjectURL(mediaStream);

	// ***** ONLY FOR TESTING *****
	otherView[0].src = window.URL.createObjectURL(mediaStream);
});

// Initiate the call
var signalingChannel = createSignalingChannel();
var peerConnection;
var configuration = ...;

// run start(true) to initiate a call
function start(isCaller) {
    peerConnection = new RTCPeerConnection(configuration);

    // send any ice candidates to the other peer
    peerConnection.onicecandidate = function (evt) {
        signalingChannel.send(JSON.stringify({ "candidate": evt.candidate }));
    };

    // once remote stream arrives, show it in the remote video element
    peerConnection.onaddstream = function (evt) {
        remoteView.src = URL.createObjectURL(evt.stream);
    };

    // get the local stream, show it in the local video element and send it
    navigator.getUserMedia({ "audio": true, "video": true }, function (stream) {
        selfView.src = URL.createObjectURL(stream);
        peerConnection.addStream(stream);

        if (isCaller)
            peerConnection.createOffer(gotDescription);
        else
            peerConnection.createAnswer(peerConnection.remoteDescription, gotDescription);

        function gotDescription(desc) {
            peerConnection.setLocalDescription(desc);
            signalingChannel.send(JSON.stringify({ "sdp": desc }));
        }
    });
}

signalingChannel.onmessage = function (evt) {
    if (!peerConnection)
        start(false);

    var signal = JSON.parse(evt.data);
    if (signal.sdp)
        peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));
    else
        peerConnection.addIceCandidate(new RTCIceCandidate(signal.candidate));
};

function createSignalingChannel() {
	var socket = new WebSocket('ws://localhost:9000/' + getParameterByName(sessionKey));
}