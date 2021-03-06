import React from "react";
import screenshotFrame from "../../../assets/img/screen-frame.png";
import Loader from "../../../Components/Loader";
import Interface from "../../../Interface";
import MessageHandler from "../../../Interface/MessageHandler";

function StaticContent(props) {
  const { vmDetails, mainPanelDisPlayNone, setMainPanelDisPlayNone } = props;

  const reloadScreenShotTimeout = React.useRef();
  const unmountedFlag = React.useRef(false);

  const [screenShotBase64, sestScreenShotBase64] = React.useState();
  const [scAlt, setScAlt] = React.useState("");
  const [scFullScreen, setScFullScreen] = React.useState(false);

  const loadScreenshot = () => {
    Interface.SendCommand(
      Interface.Commands.GetVmScreenshot,
      {},
      vmDetails.VmRecordId
    );
  };

  const osType = React.useRef("");
  const [osLogo, setOsLogo] = React.useState(
    window.OsLogos && window.OsLogos.other ? window.OsLogos.other : ""
  );

  if (vmDetails) {
    var TemplateName = vmDetails.TemplateName;

    if (vmDetails.OsType !== osType.current) {
      osType.current = vmDetails.OsType;
      var newOsLogo = "";

      if (window.OsTags[TemplateName]) {
        newOsLogo = window.OsTags[TemplateName];
      } else if (window.OsTags[vmDetails.OsType]) {
        newOsLogo = window.OsTags[vmDetails.OsType];
      } else if (window.OsLogos["other"]) {
        newOsLogo = window.OsLogos["other"];
      }
      if (osLogo !== newOsLogo) {
        setOsLogo(newOsLogo);
      }
    }
  }

  React.useEffect(() => {
    MessageHandler.On(
      MessageHandler.MessageTypes.SetVmScreenshot,
      (data, vmRecordId) => {
        if (`${vmRecordId}` !== `${vmDetails.VmRecordId}`) return;
        if (unmountedFlag.current) return;
        if (data.startsWith("{")) {
          var parsedData = JSON.parse(data);
          if (parsedData.err) {
            if (parsedData.err === "VM is not PoweredOn") {
              setScAlt("VM is Offline");
            } else if (parsedData.err === "VM is not Deployed") {
              setScAlt("VM is not deployed");
            } else {
              console.log("Error on getting vm screenshot", parsedData);
            }
          }
          sestScreenShotBase64("");
        } else {
          sestScreenShotBase64(data);
        }
        if (!reloadScreenShotTimeout.current) {
          clearTimeout(reloadScreenShotTimeout.current);
        }
        reloadScreenShotTimeout.current = setTimeout(() => {
          reloadScreenShotTimeout.current = null;
          loadScreenshot();
        }, 2000);
      }
    );
    loadScreenshot();
    return () => {
      if (reloadScreenShotTimeout.current) {
        clearTimeout(reloadScreenShotTimeout.current);
      }
      unmountedFlag.current = true;
    };
  }, []);

  if (scFullScreen) {
    if (!mainPanelDisPlayNone) {
      setMainPanelDisPlayNone(true);
    }
  } else {
    if (mainPanelDisPlayNone) {
      setMainPanelDisPlayNone(false);
    }
  }

  return (
    <>
      <div className={`d-flex justify-content-center align-items-center pt-3`}>
        <div
          className={`screenshotFrame`}
          style={{
            backgroundImage: `url(${screenshotFrame})`,
            backgroundSize: "contain",
          }}
        >
          <img
            className={`d-flex justify-content-center align-items-center ${
              scFullScreen ? "viewFullScreen" : ""
            }`}
            style={{
              color: "#fff",
              width: "96%",
            }}
            alt={Interface.i18n.T(scAlt)}
            src={
              screenShotBase64 && screenShotBase64 !== ""
                ? `data:image/png;base64,${screenShotBase64}`
                : undefined
            }
            onClick={() => {
              setScFullScreen(!scFullScreen);
            }}
          />
        </div>
      </div>
      <div
        className={`d-flex justify-content-center align-items-center pt-3`}
        style={{
          flexDirection: "column",
          direction: Interface.i18n.GetLangDirection(),
        }}
      >
        <span className={`mb-2`}>
          <b>{Interface.i18n.T("IP Address")}:</b>
          {vmDetails ? vmDetails.IpAddress : "-"}
        </span>
        <span className={`mb-2`}>
          <b>{Interface.i18n.T("Password")}:</b>
          {vmDetails ? vmDetails.OsPassword : "-"}
        </span>

        <img className={`mb-1`} style={{ width: "100px" }} src={osLogo} />
        <span className={`mb-3 w-100 text-center`}>
          {vmDetails ? vmDetails.TemplateName : ""}
        </span>

        <OpenConsoleButton vmDetails={vmDetails} />
      </div>
      <div className={`py-5`}></div>
    </>
  );
}

function OpenConsoleButton(props) {
  const { vmDetails } = props;

  const [loading, setLoading] = React.useState(false);

  const onClick = () => {
    Interface.Requests.MakeRequest(
      Interface.Requests.RequestTypes.CreateWMKSTicket,
      {
        VmRecordId: vmDetails.VmRecordId,
      },
      {
        ResponseCode: 2005,
        OnlyOnce: true,
        Callback: (content) => {
          try {
            var parsedData = JSON.parse(content);
            window
              .open(
                `${window.location.href.split("?")[0]}?wmksAddress=${
                  parsedData.Ticket
                }&vmName=${parsedData.Hostname}`,
                "_blank"
              )
              .focus();
          } catch {
            Interface.Alert.Show(Interface.i18n.T(content), "error");
          }
          setLoading(false);
        },
      }
    );
    setLoading(true);
  };

  return (
    <>
      {loading ? (
        <Loader flat style={{ margin: "12px 0" }} />
      ) : (
        <button
          disabled={!vmDetails || vmDetails.Status !== "PoweredOn"}
          className={`btn btn-sm btn-outline-primary`}
          onClick={onClick}
        >
          {Interface.i18n.T("Open Console in new tab")}
        </button>
      )}
    </>
  );
}

export default StaticContent;
