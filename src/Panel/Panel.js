import React from "react";
import { Button } from "react-bootstrap";
import Loader from "../Components/Loader";
import Interface from "../Interface";
import MessageHandler from "../Interface/MessageHandler";
import CurrentAction from "./CurrentAction";
import NavBar from "./NavBar";
import QuickActions from "./QuickActions";
import Theme from "./Theme";
import WMKS from "../WMKS";
import PanelContent from "./PanelContent";
import InstallPWA from "./InstallPWA";

function Panel(props) {
  const { onLogout } = props;

  const [refreshT, refresh] = React.useState(false);

  const [bottomLineFullScreen, setBottomLineFullScreen] = React.useState(false);

  const [vmDetails, setVmDetails] = React.useState();

  const Refresh = () => {
    refresh(!refreshT);
    Interface.SendCommand(Interface.Commands.GetPanelDetails);
  };

  const changeMachine = (Id) => () => {
    Interface.SetCurrentVmRecordId(Id);
    Interface.SendCommand(Interface.Commands.GetPanelDetails, false, Id);
    setVmDetails();
    Refresh();
  };

  React.useEffect(() => {
    MessageHandler.On(MessageHandler.MessageTypes.SetPanelDetails, (data) => {
      var parsedData = JSON.parse(data);
      Interface.SetCurrentVmRecordId(parsedData.VmRecordId);
      setVmDetails(parsedData);
    });
  }, []);

  var positionAt = "bottom";
  if (Interface.Utils.qs.GetQuery("navBottom")) {
    positionAt = "top";
  }

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          height: bottomLineFullScreen ? "100vh" : "unset",
          overflowY: bottomLineFullScreen ? "hidden" : "auto",
        }}
        className={`panelRoot ${Interface.Theme.GetThemeAndModeClassName()}`}
      >
        <NavBar
          key={refreshT ? "1" : "0"}
          changeMachine={changeMachine}
          vmDetails={vmDetails}
          Refresh={Refresh}
          onLogout={onLogout}
        />
        {vmDetails ? (
          !vmDetails.IsSuspended ? (
            <>
              <QuickActions
                dNone={bottomLineFullScreen}
                key={refreshT ? "1" : "0"}
                vmDetails={vmDetails}
              />
              <PanelContent
                dNone={bottomLineFullScreen}
                key={refreshT ? "3" : "2"}
                vmDetails={vmDetails}
              />
            </>
          ) : (
            <div
              className={`d-flex justify-content-center align-items-center`}
              style={{ width: "100vw", height: "100vh", position: "fixed" }}
            >
              {Interface.i18n.T("Service is Suspended")}
            </div>
          )
        ) : (
          <div
            className={`d-flex justify-content-center align-items-center`}
            style={{ width: "100vw", height: "100vh", position: "fixed" }}
          >
            <Loader />
          </div>
        )}

        <div
          className={`d-flex`}
          style={{
            position: "fixed",
            bottom: positionAt === "bottom" ? "0" : "unset",
            top: positionAt === "top" ? "0" : "unset",
            left: "0",
            right: "0",
            height: bottomLineFullScreen ? "100vh" : "unset",
            flexDirection:
              positionAt === "bottom" ? "column-reverse" : "column",
          }}
        >
          <CurrentAction key={refreshT ? "1" : "0"} />

          <WMKS
            isFullScreen={bottomLineFullScreen}
            setFullScreen={(s) => setBottomLineFullScreen(!!s)}
          />
        </div>
      </div>
      <InstallPWA vmDetails={vmDetails} />
      <Theme Refresh={Refresh} />
    </>
  );
}

export default Panel;
