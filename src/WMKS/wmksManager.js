import EVENTS from "./events";

function WMKS_Manager() {
  this.VmRecordId = "";
  this.ConsoleContainer = null;
  this.minimized = false;
  this.name = "";
  this.URL = "";
  this.Id = "";
  this.KeyboardLayout = "en-US";
  this.OnConnectionStateChanged = EVENTS.onConnectionStateChangeHandler;

  this.Create = (ConsoleContainer) => {
    this.Conn = window.WMKS.createWMKS(ConsoleContainer, {
      rescale: true,
      changeResolution: true,
      position: window.WMKS.CONST.Position.CENTER,
    });
    var constEvent = window.WMKS.CONST.Events;
    this.Conn.register(constEvent.CONNECTION_STATE_CHANGE, (event, data) => {
      if (typeof this.OnConnectionStateChanged !== "function") {
        EVENTS.onConnectionStateChangeHandler(event, data);
      } else {
        this.OnConnectionStateChanged(event, data);
      }
      this.SetKeyboardLayout(this.KeyboardLayout);
    })
      .register(
        constEvent.REMOTE_SCREEN_SIZE_CHANGE,
        EVENTS.onScreenSizeChangeHandler
      )
      .register(constEvent.FULL_SCREEN_CHANGE, EVENTS.onFullscreenChangeHandler)
      .register(constEvent.ERROR, EVENTS.onErrorHandler)
      .register(constEvent.KEYBOARD_LEDS_CHANGE, EVENTS.onLedChangeHandler)
      .register(constEvent.HEARTBEAT, EVENTS.onHeartbeatHandler);
  };

  this.Connect = () => {
    if (!this.Conn) return;
    try {
      this.Conn.connect(this.URL);
      console.log("connect succeeded");
    } catch (err) {
      console.log("connect failed: " + err);
    }
  };

  this.Disconnect = () => {
    if (!this.Conn) return;
    try {
      this.Conn.disconnect();
      console.log("disconnect succeeded");
    } catch (err) {
      console.log("disconnect failed: " + err);
    }
  };

  this.SetKeyboardLayout = (layoutId) => {
    if (!this.Conn) return;
    /*
      layoutId can be one of these
      en-US -> English
      ja-JP_106/109 -> Japanese 
      de-DE -> German
      it-IT -> Italian
      es-ES -> Spanish
      pt-PT -> Portuguese
      fr-FR -> French 
      fr-CH -> Swiss-French
      de-CH -> Swiss-German
    */
    this.KeyboardLayout = layoutId;
    this.Conn.setOption("keyboardLayoutId", layoutId);
  };

  this.Destroy = () => {
    try {
      this.Conn.destroy();
      this.Conn = null;
    } catch (err) {
      console.log("destroy call failed: " + err.description);
      return;
    }
  };

  this.IsNotConnected = () => {
    if (!this.Conn) return true;
    if (
      this.Conn.getConnectionState() ===
      window.WMKS.CONST.ConnectionState.CONNECTED
    ) {
      return false;
    }
    return true;
  };

  this.SetRemoteScreenSize = (W, H) => {
    if (!this.Conn) return true;
    this.Conn.setRemoteScreenSize(W, H);
  };

  this.SendCAD = () => {
    if (!this.Conn) return true;
    this.Conn.sendCAD();
  };

  this.SendText = (text) => {
    if (!this.Conn) return true;
    this.Conn.sendInputString(text);
  };

  this.SendCharCode = (code) => {
    if (!this.Conn) return true;
    this.Conn.sendKeyCodes([code]);
  };

  this.EnterFullScreen = () => {
    if (!this.Conn) return true;
    this.Conn.enterFullScreen();
  };

  this.Close = () => {
    if (!this.Conn) return true;
    this.Disconnect();
    this.Destroy();
  };
}

export default WMKS_Manager;
