import React from "react";
import { Container, Modal, ButtonGroup, Button } from "react-bootstrap";

import pwrOff from "../../assets/img/pwroff.png";
import pwrOn from "../../assets/img/pwron.png";
import restart from "../../assets/img/restart.png";
import suspend from "../../assets/img/suspend.png";
import wmks from "../../assets/img/wmks.png";
import SVGs from "../../assets/SVGs";
import Loader from "../../Components/Loader";
import Interface from "../../Interface";

function QuickActions_Classic(props) {
  const { vmDetails, dNone } = props;

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

  return (
    <>
      <Container
        className={`d-flex justify-content-center py-3 px-lg-5 ${
          dNone ? "d-none" : ""
        }`}
        style={{
          flexDirection: "row-reverse",
          flexWrap: "wrap",
        }}
      >
        <div
          className={`col-12 col-md-6 col-lg-4 d-flex justify-content-center`}
          style={{ flexDirection: "column" }}
        >
          <div className={`OsLogo`}>
            <img src={osLogo} />
            <div className={`templateName`}>
              {vmDetails ? vmDetails.TemplateName : ""}
            </div>
          </div>
        </div>
        <div
          className={`col-12 col-md-6 col-lg-6 d-flex`}
          style={{ flexDirection: "column", alignItems: "stretch" }}
        >
          <div className={`quickActionsCard px-lg-5`}>
            <Actions vmDetails={vmDetails} />
          </div>
          <div className={`serverDetailsCard d-block`}>
            <p
              className={`serverDetails`}
              style={{ direction: Interface.i18n.GetLangDirection() }}
            >
              <b>{Interface.i18n.T("Status")}</b>:{" "}
              {vmDetails ? <VmStatus vmDetails={vmDetails} /> : "..."}
              <br />
              <b>{Interface.i18n.T("IP Address")}:</b>{" "}
              {vmDetails ? vmDetails.IpAddress : "..."}
              <br />
              <b>{Interface.i18n.T("Hostname")}:</b>{" "}
              {vmDetails
                ? vmDetails.Hostname !== ""
                  ? vmDetails.Hostname
                  : "-"
                : "..."}
              <br />
              <b>{Interface.i18n.T("Uptime")}:</b>{" "}
              {vmDetails
                ? vmDetails.UptimeSeconds !== 0
                  ? Interface.Utils.Time.SecondsToElapsed(
                      vmDetails.UptimeSeconds
                    )
                  : "0"
                : "..."}
              <br />
            </p>
          </div>
        </div>
      </Container>
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
    <span style={{ color: color }}>{Interface.i18n.T(vmDetails.Status)}</span>
  );
}

function Actions(props) {
  var { vmDetails } = props;
  if (!vmDetails) {
    vmDetails = {};
  }
  var { Actions } = vmDetails;

  if (!Actions || !Actions.length) {
    Actions = [];
  }

  const [confirmShown, setConfirmShown] = React.useState(false);
  const [currentActionToDo, setCurrentActionToDo] = React.useState("");
  const [wmksRequested, setWmksRequested] = React.useState(false);

  const DoQuickAction = (action) => () => {
    if (action === "wmks") {
      if (wmksRequested) return;
      Interface.WMKS.CreateNewWMKS(vmDetails.VmRecordId, () => {
        setWmksRequested(false);
      });
      setWmksRequested(true);
      return;
    }
    setCurrentActionToDo(action);
    setConfirmShown(true);
  };

  const yesClicked = () => {
    Interface.SendCommand(`${currentActionToDo}`);
    setConfirmShown(false);
    setCurrentActionToDo("");
  };

  return (
    <>
      {wmksRequested ? (
        <Loader flat width={"50px"} />
      ) : (
        <SVGs.Monitor
          className={`action p-2 ${
            vmDetails && vmDetails.Status === "PoweredOn" ? "" : "disabled"
          }`}
          size={"60"}
          style={{ color: "#999" }}
          onClick={
            vmDetails && vmDetails.Status === "PoweredOn"
              ? DoQuickAction("wmks")
              : () => {}
          }
        />
      )}

      <SVGs.Pause
        className={`action p-2 
            ${Actions.includes("VmSuspend") ? "" : "disabled"}
          `}
        size={"60"}
        style={{ color: "#999" }}
        onClick={
          Actions.includes("VmSuspend") ? DoQuickAction("VmSuspend") : () => {}
        }
      />
      <SVGs.Power
        className={`action p-2 
            ${Actions.includes("PowerOff") ? "" : "disabled"}
          `}
        size={"60"}
        style={{ color: "#dc3545" }}
        onClick={
          Actions.includes("PowerOff") ? DoQuickAction("PowerOff") : () => {}
        }
      />
      <SVGs.Play
        className={`action p-2 
            ${Actions.includes("PowerOn") ? "" : "disabled"}
          `}
        size={"60"}
        style={{ color: "#198754" }}
        onClick={
          Actions.includes("PowerOn") ? DoQuickAction("PowerOn") : () => {}
        }
      />
      <SVGs.Repeat
        className={`action p-2 
            ${Actions.includes("PowerReset") ? "" : "disabled"}
          `}
        size={"60"}
        style={{ color: "#0d6efd" }}
        onClick={
          Actions.includes("PowerReset")
            ? DoQuickAction("PowerReset")
            : () => {}
        }
      />

      <Modal
        show={confirmShown}
        centered
        onHide={() => {
          setConfirmShown(false);
          setCurrentActionToDo("");
        }}
      >
        <Modal.Header style={{ direction: Interface.i18n.GetLangDirection() }}>
          <Modal.Title>{Interface.i18n.T("Are you sure?")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 style={{ direction: Interface.i18n.GetLangDirection() }}>
            {currentActionToDo === "VmSuspend"
              ? Interface.i18n.T(
                  "You are about to Suspend (Hibernate) your server..."
                )
              : currentActionToDo === "PowerOff"
              ? Interface.i18n.T("You are about to Power off your server...")
              : currentActionToDo === "PowerOn"
              ? Interface.i18n.T("You are about to Power on your server...")
              : currentActionToDo === "PowerReset"
              ? Interface.i18n.T("You are about to Restart your server...")
              : ""}
          </h6>
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup style={{ direction: "ltr" }}>
            <Button
              variant={"outline-primary"}
              onClick={() => {
                setConfirmShown(false);
                setCurrentActionToDo("");
              }}
            >
              {Interface.i18n.T("No")}
            </Button>
            <Button onClick={yesClicked}>{Interface.i18n.T("Yes")}</Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default QuickActions_Classic;
