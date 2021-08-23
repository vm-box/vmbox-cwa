import React from "react";
import {
  InputGroup,
  FormControl,
  Button,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import SVGs from "../assets/SVGs";
import Loader from "../Components/Loader";
import Interface from "../Interface";
import WMKS_Manager from "./wmksManager";

function WmksRoot(props) {
  const { isFullScreen, setFullScreen, isRoot } = props;

  const [rerenderT, rerender] = React.useState(false);

  const AllConnections = React.useRef([]);

  React.useEffect(() => {
    if (window.location.search.includes("wmksAddress=")) {
      var url = Interface.Utils.qs.GetQuery("wmksAddress");
      var name = Interface.Utils.qs.GetQuery("vmName");
      var newWMKS = new WMKS_Manager();
      newWMKS.URL = url;
      newWMKS.name = name ? `${name}` : "";
      newWMKS.Id = `wmksConsole_${Number(new Date())}`;
      if (window.Defaults.WMKS && window.Defaults.WMKS.DefaultKeyboardLayout) {
        newWMKS.KeyboardLayout = window.Defaults.WMKS.DefaultKeyboardLayout;
      }
      AllConnections.current = [newWMKS];
      rerender(!rerenderT);
      return;
    }
    Interface.WMKS.CreateNewWMKS = (vmRecordId, onDone) => {
      var currentlyOpenned = AllConnections.current.filter(
        (c) => c.VmRecordId === vmRecordId
      );
      if (currentlyOpenned.length > 0) {
        currentlyOpenned[0].minimized = false;
        setTimeout(() => {
          if (typeof onDone === "function") onDone();
        }, 200);
        rerender(!rerenderT);
        return;
      }
      Interface.Requests.MakeRequest(
        Interface.Requests.RequestTypes.CreateWMKSTicket,
        {
          VmRecordId: vmRecordId,
        },
        {
          ResponseCode: 2005,
          OnlyOnce: true,
          Callback: (content) => {
            try {
              var parsedData = JSON.parse(content);
              var newWMKS = new WMKS_Manager();
              newWMKS.VmRecordId = vmRecordId;
              newWMKS.URL = parsedData.Ticket;
              newWMKS.name = parsedData.Hostname;
              newWMKS.Id = `wmksConsole_${Number(new Date())}`;
              if (
                window.Defaults.WMKS &&
                window.Defaults.WMKS.DefaultKeyboardLayout
              ) {
                newWMKS.KeyboardLayout =
                  window.Defaults.WMKS.DefaultKeyboardLayout;
              }
              newWMKS.OnConnectionStateChanged = (event, data) => {
                if (
                  data.state === window.WMKS.CONST.ConnectionState.DISCONNECTED
                ) {
                  setTimeout(() => {
                    if (
                      AllConnections.current.filter((c) => c.Id === newWMKS.Id)
                        .length > 0
                    ) {
                      Interface.WMKS.CreateNewWMKS(vmRecordId, () => {
                        closeWMKSById(newWMKS.Id);
                      });
                    }
                  }, 1000);
                }
              };
              AllConnections.current.push(newWMKS);
              rerender(!rerenderT);
            } catch {
              Interface.Alert.Show(Interface.i18n.T(content), "error");
            }
            if (typeof onDone === "function") onDone();
          },
        }
      );
    };
  }, []);

  var hasOpenConsole =
    AllConnections.current.filter((o) => !o.minimized).length > 0;
  var hasMinimizedConsole =
    AllConnections.current.filter((o) => o.minimized).length > 0;

  if (setFullScreen && typeof setFullScreen === "function") {
    if (!isFullScreen && hasOpenConsole) {
      setFullScreen(true);
    } else if (isFullScreen && !hasOpenConsole) {
      setFullScreen(false);
    }
  }

  const closeWMKS = (i) => () => {
    if (AllConnections.current[i]) {
      AllConnections.current[i].Close();
      AllConnections.current.splice(i, 1);
      rerender(!rerenderT);
      if (isRoot) {
        window.close();
      }
    }
  };

  const closeWMKSById = (Id) => {
    AllConnections.current = AllConnections.current.filter((c) => c.Id !== Id);
    rerender(!rerenderT);
  };

  var phoneType = false;
  var bodyElem = window.$("body");
  if (bodyElem && bodyElem.width() < bodyElem.height()) {
    phoneType = true;
  }

  return (
    <div
      className={`d-flex wmksMainContainer`}
      style={{
        flex: "1",
        flexDirection: "column",
        ...(isRoot
          ? { width: "100%", height: "100vh", overflow: "hidden" }
          : {}),
      }}
    >
      <div
        className={`wmksConnectionsContainer row w-100`}
        style={{
          margin: "0",
          flex: "1",
          display: hasOpenConsole ? "flex" : "none",
        }}
      >
        {AllConnections.current.map((c, i) => (
          <WmksConsole
            className={`col-xs-12 ${
              !phoneType &&
              AllConnections.current &&
              AllConnections.current.filter((c) => !c.minimized).length > 1
                ? "col-md-6"
                : ""
            }`}
            isRoot={isRoot}
            Connection={c}
            key={i}
            onMinimize={() => {
              c.minimized = true;
              rerender(!rerenderT);
            }}
            onClose={closeWMKS(i)}
          />
        ))}
      </div>
      <div
        className={`wmksMinimizedConnectionsContainer d-flex justify-content-start align-items-start`}
        style={{
          flexWrap: "wrap",
          display: hasMinimizedConsole ? "unset" : "none",
        }}
      >
        {AllConnections.current
          .filter((c) => !!c.minimized)
          .map((c, i) => (
            <div
              className={`col-12 col-sm-6 col-md-3 col-lg-2 p-1 btn btn-sm btn-primary rounded-0`}
              key={i}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  c.minimized = false;
                  rerender(!rerenderT);
                }}
              >
                {c.name}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function WmksConsole(props) {
  const { Connection, onMinimize, onClose, className, isRoot } = props;

  const [rerenderT, rerender] = React.useState(false);

  const wmksToolbar = React.useRef();
  const wmksContainer = React.useRef();
  const currentConsoleSize = React.useRef({
    Interval: null,
    lastSync: parseInt(new Date() / 1000),
  });

  var consoleHeight = isRoot
    ? wmksToolbar.current
      ? `${
          window.$("body").height() - window.$(wmksToolbar.current).height()
        }px`
      : `${window.$("body").height() - 24}px`
    : wmksContainer.current && wmksToolbar.current
    ? `${
        window.$(wmksContainer.current).height() -
        window.$(wmksToolbar.current).height()
      }px`
    : "95%";

  React.useEffect(() => {
    Connection.Create(`${Connection.Id}`);
    Connection.Connect();
    currentConsoleSize.current.Interval = setInterval(() => {
      var elem = document.getElementById(`${Connection.Id}`);
      if (elem) {
        var w = window.$(elem).width();
        var h = window.$(elem).height();
        if (!currentConsoleSize.current.w) {
          currentConsoleSize.current.w = w;
        }
        if (!currentConsoleSize.current.h) {
          currentConsoleSize.current.h = h;
        }
        var now = parseInt(new Date() / 1000);
        if (
          currentConsoleSize.current.w !== w ||
          currentConsoleSize.current.h !== h ||
          now - currentConsoleSize.current.lastSync > 5
        ) {
          Connection.SetRemoteScreenSize(w, h);
          currentConsoleSize.current.lastSync = now;
        }
      } else {
        clearInterval(currentConsoleSize.current.Interval);
      }
    }, 2000);
  }, []);

  return (
    <div
      className={className}
      style={{
        display: Connection.minimized ? "none" : "unset",
        padding: "0",
        border: "1px solid black",
      }}
    >
      <div
        ref={wmksContainer}
        className={`d-flex justify-content-center align-items-center`}
        style={{ position: "relative", height: isRoot ? "100vh" : "100%" }}
      >
        <div
          ref={wmksToolbar}
          className={`wmks_toolbar d-flex ${
            (wmksToolbar.current &&
              window.$(wmksToolbar.current).height() < 48) ||
            isRoot
              ? `justify-content-between`
              : `justify-content-around`
          }`}
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            backgroundColor: "#2196f3",
            color: "#fff",
            flexWrap: "wrap",
            flexDirection: "row-reverse",
          }}
        >
          <span>
            <span
              style={{
                fontSize: "0.8rem",
                marginLeft: "2px",
                whiteSpace: "nowrap",
                padding: "2px 5px",
              }}
              className={`d-inline d-sm-none btn btn-sm btn-secondary`}
              onClick={() => {
                Connection.Conn.showKeyboard();
              }}
            >
              {Interface.i18n.T("Show Keyboard")}
            </span>
            <DropdownButton
              size={"sm"}
              title={Connection.KeyboardLayout}
              style={{ display: "inline", marginRight: "10px" }}
            >
              {[
                "en-US",
                "ja-JP_106/109",
                "de-DE",
                "it-IT",
                "es-ES",
                "pt-PT",
                "fr-FR",
                "fr-CH",
                "de-CH",
              ].map((l, i) => (
                <Dropdown.Item
                  key={i}
                  onSelect={() => {
                    Connection.KeyboardLayout = l;
                    Connection.SetKeyboardLayout(l);
                    rerender(!rerenderT);
                  }}
                >
                  {l}
                </Dropdown.Item>
              ))}
            </DropdownButton>
            {!isRoot ? (
              <SVGs.Minus
                style={{
                  cursor: "pointer",
                  marginBottom: "-6px",
                  marginRight: "4px",
                }}
                onClick={onMinimize}
              />
            ) : undefined}
            <SVGs.Maximize
              size={18}
              style={{
                cursor: "pointer",
                marginRight: "6px",
              }}
              onClick={() => Connection.EnterFullScreen()}
            />
            <SVGs.XSquare
              style={{ cursor: "pointer", marginTop: "-2px" }}
              onClick={() => onClose()}
            />
          </span>
          <span className={`d-block d-sm-none w-100 text-center py-1 py-sm-0`}>
            {Connection.name}
          </span>
          <span className={`d-none d-sm-block py-1 py-sm-0`}>
            {Connection.name}
          </span>
          <span className={`d-flex justify-content-start py-1 py-sm-0`}>
            <span
              className={`btn btn-sm btn-secondary`}
              style={{
                fontSize: "0.8rem",
                marginLeft: "2px",
                whiteSpace: "nowrap",
                padding: "2px 5px",
              }}
              onClick={() => Connection.SendCAD()}
            >
              {Interface.i18n.T("Send Ctrl+Alt+Del")}
            </span>
            <InputGroup className="ml-1" style={{ padding: "1px 0 1px 15px" }}>
              <FormControl
                id={`${Connection.Id}_inpText`}
                style={{
                  width: "100px",
                  height: "22px",
                  fontSize: "0.8rem",
                  padding: "6px",
                }}
                placeholder={`${Interface.i18n.T("Enter text")}`}
                onKeyPress={(e) => {
                  var keyCode = e.code || e.key;
                  if (keyCode === "Enter" || keyCode === "NumpadEnter") {
                    var E = window.$(`#${Connection.Id}_inpText`);
                    if (E) {
                      Connection.SendText(E.val());
                    }
                  }
                }}
              />
              <Button
                style={{ height: "22px", padding: "0 4px", fontSize: "0.8rem" }}
                variant="secondary"
                onClick={() => {
                  var E = window.$(`#${Connection.Id}_inpText`);
                  if (E) {
                    Connection.SendText(E.val());
                  }
                }}
              >
                {Interface.i18n.T("to Type")}
              </Button>
            </InputGroup>
          </span>
        </div>
        <div
          id={Connection.Id}
          className={`d-flex justify-content-center align-items-center`}
          style={{
            position: "absolute",
            width: "100%",
            height: consoleHeight,
            backgroundColor: "#000000d0",
            top: wmksToolbar.current
              ? `${window.$(wmksToolbar.current).height()}px`
              : "24px",
            overflow: "auto",
          }}
        >
          <Loader signal style={{ color: "#fff" }} />
        </div>
      </div>
    </div>
  );
}

export default WmksRoot;
