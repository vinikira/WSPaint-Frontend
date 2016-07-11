(function () {
	angular
		.module("wspaint")
		.factory("webSocket", wsService);

	function wsService() {		
		var socket = io('http://localhost:8080');
		return {
			on: function (eventName, callback) {
			    socket.on(eventName, callback);
			},
			emit: function (eventName, data, callback) {
			    socket.emit(eventName, data, callback);
			}
		}
	}
})();