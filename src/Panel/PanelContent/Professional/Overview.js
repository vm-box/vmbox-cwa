import React from "react";
import screenshotFrame from "../../../assets/img/screen-frame.png";
import SVGs from "../../../assets/SVGs";
import Loader from "../../../Components/Loader";
import Interface from "../../../Interface";
import MessageHandler from "../../../Interface/MessageHandler";
import Install from "./Install";
import Scripts from "./Scripts";

function Overview(props) {
  const { vmDetails } = props;

  const reloadScreenShotTimeout = React.useRef();
  const unmountedFlag = React.useRef(false);

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
          reloadScreenShotTimeout.current = setTimeout(() => {
            reloadScreenShotTimeout.current = null;
            loadScreenshot();
          }, 2000);
        }
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

  return (
    <>
      <div
        className={`d-flex justify-content-center px-5 py-3`}
        style={{
          flexWrap: "wrap",
          direction: Interface.i18n.GetLangDirection(),
        }}
      >
        <div
          className={`screenshotFrame mb-4`}
          style={{
            backgroundImage: `url(${screenshotFrame})`,
            direction: "ltr",
          }}
        >
          <img
            className={`d-flex justify-content-center align-items-center ${
              scFullScreen ? "viewFullScreen" : ""
            }`}
            style={{
              color: "#fff",
            }}
            alt={Interface.i18n.T(scAlt)}
            src={
              screenShotBase64
                ? `data:image/png;base64,${screenShotBase64}`
                : undefined
            }
            onClick={() => {
              setScFullScreen(!scFullScreen);
            }}
          />
        </div>
        <div
          className={`px-5 py-2 mb-4 col-xs-12 col`}
          style={{
            flexGrow: "1",
          }}
        >
          <div
            className={`w-100`}
            style={{
              maxWidth: "400px",
              minWidth: "240px",
            }}
          >
            <div className={``}>
              <span
                className={`propTitle`}
                style={{
                  width: "120px",
                  display: "inline-block",
                  textAlign: "right",
                }}
              >
                {Interface.i18n.T("Status")}:
              </span>
              <VmStatus vmDetails={vmDetails} />
            </div>
            <Prop vmDetails={vmDetails} name={"Hostname"} title={"Hostname"} />
            <Prop
              vmDetails={vmDetails}
              name={"IpAddress"}
              title={"IP Address"}
            />
            <Prop
              vmDetails={vmDetails}
              name={"OsPassword"}
              title={"Password"}
            />
            {vmDetails.UptimeSeconds && vmDetails.UptimeSeconds > 0 ? (
              <div className={``}>
                <span
                  className={`propTitle`}
                  style={{
                    width: "120px",
                    display: "inline-block",
                    textAlign: "right",
                  }}
                >
                  {Interface.i18n.T("Uptime")}:
                </span>
                <span className={`mx-1`} style={{ display: "inline-block" }}>
                  {Interface.Utils.Time.SecondsToElapsed(
                    vmDetails.UptimeSeconds
                  )}
                </span>
              </div>
            ) : undefined}
            <div className={``}>
              <span
                className={`propTitle`}
                style={{
                  width: "120px",
                  display: "inline-block",
                  textAlign: "right",
                }}
              >
                {Interface.i18n.T("OS")}:
              </span>
              <img
                src={osLogo}
                style={{ width: "20px", margin: "0 .2rem 0 .5rem" }}
              />
              <span style={{ display: "inline-block" }}>
                {vmDetails.TemplateName}
              </span>
            </div>
          </div>
        </div>
        <div className={`mb-4`} style={{ width: "150px", direction: "ltr" }}>
          <div className={`d-flex align-items-center`}>
            <SVGs.CPU size={32} />
            <div style={{ display: "inline-block", marginLeft: "12px" }}>
              <div style={{ fontSize: "1.2rem" }}>
                {window.Defaults &&
                window.Defaults.ProfessionalPanel &&
                window.Defaults.ProfessionalPanel.Overview &&
                window.Defaults.ProfessionalPanel.Overview.ShowMultipliedVCore
                  ? `${vmDetails.CpuSockets * vmDetails.CpuCores}`
                  : `${
                      vmDetails.CpuSockets > 1
                        ? `${vmDetails.CpuSockets}x${vmDetails.CpuCores}`
                        : vmDetails.CpuCores
                    }`}{" "}
                vCore
              </div>
              <div style={{ fontSize: ".7rem" }}>
                {SimpleFormat(vmDetails.OverallCpuUsage)}Hz{" "}
                {Interface.i18n.T("in use")}
              </div>
            </div>
          </div>
          <div
            style={{
              width: "75%",
              margin: "0.5rem auto",
              height: "1px",
              backgroundColor: "#aaaaaa80",
            }}
          ></div>
          <div className={`d-flex align-items-center`}>
            <SVGs.RAM
              size={36}
              style={
                window.currentThemeMode.current === "dark"
                  ? { fill: "#fff" }
                  : {}
              }
            />
            <div style={{ display: "inline-block", marginLeft: "12px" }}>
              <div style={{ fontSize: "1.2rem" }}>
                {window.Defaults &&
                window.Defaults.ProfessionalPanel &&
                window.Defaults.ProfessionalPanel.Overview &&
                window.Defaults.ProfessionalPanel.Overview.UseAllocatedMemory
                  ? `${SimpleFormat(vmDetails.AllocatedMemory)}B`
                  : `${SimpleFormat(vmDetails.MaxMemoryUsage)}B`}
              </div>
              <div style={{ fontSize: ".7rem" }}>
                {SimpleFormat(vmDetails.GuestMemoryUsage)}B{" "}
                {Interface.i18n.T("in use")}
              </div>
            </div>
          </div>
          <div
            style={{
              width: "75%",
              margin: "0.5rem auto",
              height: "1px",
              backgroundColor: "#aaaaaa80",
            }}
          ></div>
          <div className={`d-flex align-items-center mb-3`}>
            <SVGs.Database size={32} />
            <div style={{ display: "inline-block", marginLeft: "12px" }}>
              <div style={{ fontSize: "1.2rem" }}>
                {SimpleFormat(vmDetails.MaxDiskUsage)}B
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`panels d-flex justify-content-center row`}
        style={{ flexWrap: "wrap", margin: "0" }}
      >
        <div className={`col-xs-12 col-md-8 col-lg-7 p-2`}>
          <Install overview vmDetails={vmDetails} />
        </div>
        <div className={`col-xs-12 col-md-8 col-lg-5 p-2`}>
          <Scripts overview vmDetails={vmDetails} />
        </div>
      </div>
      <div className={`py-5`}></div>
    </>
  );
}

function VmStatus(props) {
  const { vmDetails } = props;

  var color = "#198754";
  if (vmDetails.IsSuspended) {
    color = "#e7515a";
  } else {
    switch (vmDetails.Status) {
      case "Registered":
        color = "#1b55e2";
        break;
      case "Deployed":
        color = "#1b55e2";
        break;
      case "PoweredOn":
        color = "#8dbf42";
        break;
      case "PoweredOff":
        color = "#e7515a";
        break;
      case "VmSuspended":
        color = "#e2a03f";
        break;
      case "Deleted":
        color = "#e7515a";
        break;
      case "NotFound":
        color = "#e7515a";
        break;
      case "pending":
        color = "#2196f3";
        break;
    }
  }
  return (
    <span className={`mx-1`} style={{ display: "inline-block", color: color }}>
      {Interface.i18n.T(vmDetails.Status)}
    </span>
  );
}

function SimpleFormat(amount) {
  if (amount % 1024 === 0) {
    return `${amount / 1024}G`;
  }
  return `${amount}M`;
}

function Prop(props) {
  const { vmDetails, name, title } = props;

  return (
    <div className={``}>
      <span
        className={`propTitle`}
        style={{ width: "120px", display: "inline-block", textAlign: "right" }}
      >
        {Interface.i18n.T(title)}:
      </span>
      <span className={`mx-1`} style={{ display: "inline-block" }}>
        {" "}
        {vmDetails[name]}
      </span>
    </div>
  );
}
export default Overview;
