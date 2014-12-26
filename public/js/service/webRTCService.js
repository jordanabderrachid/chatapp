chatApp.factory('webRTCService', function () {
	var config = {
		iceServers: [
			{
				url: 'stun:stun.l.google.com:19302'
			}
		]
	};
	var rtc = new webkitRTCPeerConnection(config);

	rtc.onicecandidate = function (event) {
		console.log(event.candidate);
	};

	rtc.ondatachannel = function (event) {
		receiveChannel = event.channel;
		receiveChannel.onmessage = function (event) {
			console.log(event.data);
		};
	};

	var dataChannels = {};

	return {
		getRTC: function () {
			return rtc;
		},

		createDataChannel: function (id) {
			var dataChannel = rtc.createDataChannel(id);
			dataChannel.onmessage = function (event) {
				console.log(event.data);
			};
			dataChannels[id] = dataChannel;
		},

		getDataChannel: function (id) {
			return dataChannels[id];
		}
	};
});