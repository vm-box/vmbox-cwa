import React from "react";
import Interface from "../Interface";
import MessageHandler from "../Interface/MessageHandler";
import Loader from "../Components/Loader";
import { Button, Container, Row } from "react-bootstrap";
import Panel from "./Panel";
import Auth from "./Auth";
import WmksRoot from "../WMKS";

function PanelRoot(props) {
  const [failed, setFailed] = React.useState(false);
  const [disconnected, setDisconnected] = React.useState(false);
  const tryAgainTimeout = React.useRef();
  const [connected, setConnected] = React.useState(false);

  const [loggedOut, setLoggedOut] = React.useState(false);

  const sync = () => {
    if (!Interface.IsConnected()) return;
    Interface.SendCommand(Interface.Commands.GetPanelDetails);
  };

  const connect = () => {
    if (tryAgainTimeout.current) {
      tryAgainTimeout.current = null;
    }
    var result = Interface.Setup(
      () => {
        // onConnectionEstablished
        setConnected(true);
        Interface.SendCommand(Interface.Commands.GetPanelDetails);
        if (window.synchronizer) {
          clearInterval(window.synchronizer);
        }
        window.synchronizer = setInterval(sync, 5000);
      },
      () => {
        // onConnectionLost
        setConnected(false);
        setDisconnected(true);
        if (!tryAgainTimeout.current) {
          tryAgainTimeout.current = setTimeout(connect, 2000);
        }
        if (window.synchronizer) {
          clearInterval(window.synchronizer);
        }
      },
      () => {
        // onConnectionErr
        setConnected(false);
        setDisconnected(true);
        if (!tryAgainTimeout.current) {
          tryAgainTimeout.current = setTimeout(connect, 2000);
        }
        if (window.synchronizer) {
          clearInterval(window.synchronizer);
        }
      }
    );
    if (!result) {
      setFailed(true);
    }
  };

  React.useEffect(() => {
    // TODO: remove this line
    window.Interface = Interface;

    var wmksAddress = Interface.Utils.qs.GetQuery("wmksAddress");

    if (wmksAddress) return;

    connect();

    MessageHandler.On(MessageHandler.MessageTypes.Reload, () => {
      Interface.SendCommand(Interface.Commands.GetPanelDetails);
    });
  }, []);

  var wmksAddress = Interface.Utils.qs.GetQuery("wmksAddress");

  return (
    <>
      {wmksAddress ? (
        <WmksRoot isFullScreen={true} isRoot={true} />
      ) : loggedOut ? (
        <Container
          style={{
            height: "100vh",
            flexDirection: "column",
            direction: Interface.i18n.GetLangDirection(),
          }}
          className={`d-flex justify-content-center align-items-center`}
        >
          <h4>
            <b style={{ direction: Interface.i18n.GetLangDirection() }}>
              {Interface.i18n.T("Logged out!")}
            </b>
          </h4>
          <h6 className={`mt-3 text-center`}>
            {Interface.i18n.T(
              "Please remove this app and open your clientarea"
            )}
          </h6>
        </Container>
      ) : failed ? (
        <Container
          style={{
            height: "100vh",
            flexDirection: "column",
            direction: Interface.i18n.GetLangDirection(),
          }}
          className={`d-flex justify-content-center align-items-center`}
        >
          <h4>
            <b>{Interface.i18n.T("We're Sorry!")}</b>
          </h4>
          <h6 className={`mt-3 text-center`}>
            {Interface.i18n.T("Failed to get the Server Address")}
            <br />
            {window.IsPwa
              ? Interface.i18n.T("Please reload the Page.")
              : Interface.i18n.T(
                  "Please remove this app and open your clientarea"
                )}
          </h6>
        </Container>
      ) : connected ? (
        <Panel
          onLogout={() => {
            setLoggedOut(true);
          }}
        />
      ) : (
        <Container
          style={{ height: "100vh", flexDirection: "column" }}
          className={`d-flex justify-content-center align-items-center`}
        >
          <Loader />
          {disconnected ? (
            <h6
              className={`mt-3`}
              style={{ direction: Interface.i18n.GetLangDirection() }}
            >
              {Interface.i18n.T("Connection failed, trying again...")}
            </h6>
          ) : (
            ""
          )}
        </Container>
      )}
      <Auth />
    </>
  );
}

export default PanelRoot;
