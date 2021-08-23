function onConnectionStateChangeHandler(event, data) {
  console.log("onConnectionStateChange - connectionState: " + data.state);
  if (data.state == window.WMKS.CONST.ConnectionState.DISCONNECTED) {
    console.log("reason is " + data.reason + ", code is" + data.code);
  }
}

function onScreenSizeChangeHandler(event, data) {
  console.log(
    "onScreenSizeChange - width: " + data.width + ", height: " + data.height
  );
}

function onFullscreenChangeHandler(event, data) {
  console.log("onFullscreenChange - fullscreen: " + data.isFullScreen);
}

function onErrorHandler(event, data) {
  console.log("onErrorHandler - error type " + data.errorType);
}

function onLedChangeHandler(event, data) {
  console.log("onLEDChange , key is " + data);
}

function onHeartbeatHandler(event, data) {
  console.log("on Heartbeat Event, interval is " + data);
}

export default {
  onConnectionStateChangeHandler,
  onScreenSizeChangeHandler,
  onFullscreenChangeHandler,
  onErrorHandler,
  onLedChangeHandler,
  onHeartbeatHandler,
};
