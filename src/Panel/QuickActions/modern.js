import React from "react";
import { Container, Modal, ButtonGroup, Button } from "react-bootstrap";
import SVGs from "../../assets/SVGs";
import Loader from "../../Components/Loader";
import Interface from "../../Interface";

function QuickActions_Modern(props) {
  const { vmDetails, dNone } = props;
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
      <div
        className={`px-2 modernQuickActions row justify-content-between w-100 ${
          dNone ? "d-none" : ""
        }`}
        style={{ margin: "0" }}
      >
        <div
          className={`serverTitle w-auto p-2 d-flex justify-content-center align-items-center`}
          style={{
            flexWrap: "wrap",
            fontSize: "1.2rem",
          }}
        >
          <span className={`mx-2`} style={{ color: "#58A6FF" }}>
            {vmDetails.IpAddress}
          </span>
          <span style={{ color: "#aaa" }}>/</span>
          <b
            className={`mx-2`}
            style={{ color: "#529CF0", fontSize: "1.1rem" }}
          >
            {vmDetails.Hostname}
          </b>
          <StatusPill vmDetails={vmDetails} />
        </div>
        <div
          className={`serverActions col-xs-12 col-sm-auto d-flex justify-content-center p-3`}
        >
          {wmksRequested ? (
            <Loader flat width={"35px"} />
          ) : (
            <SVGs.Monitor
              className={`action ${
                vmDetails && vmDetails.Status === "PoweredOn" ? "" : "disabled"
              }`}
              size={"35"}
              style={{ color: "#999" }}
              onClick={
                vmDetails && vmDetails.Status === "PoweredOn"
                  ? DoQuickAction("wmks")
                  : () => {}
              }
            />
          )}

          <SVGs.Pause
            className={`action 
            ${Actions.includes("VmSuspend") ? "" : "disabled"}
          `}
            size={"35"}
            style={{ color: "#999" }}
            onClick={
              Actions.includes("VmSuspend")
                ? DoQuickAction("VmSuspend")
                : () => {}
            }
          />
          <SVGs.Power
            className={`action 
            ${Actions.includes("PowerOff") ? "" : "disabled"}
          `}
            size={"35"}
            style={{ color: "#dc3545" }}
            onClick={
              Actions.includes("PowerOff")
                ? DoQuickAction("PowerOff")
                : () => {}
            }
          />
          <SVGs.Play
            className={`action 
            ${Actions.includes("PowerOn") ? "" : "disabled"}
          `}
            size={"35"}
            style={{ color: "#198754" }}
            onClick={
              Actions.includes("PowerOn") ? DoQuickAction("PowerOn") : () => {}
            }
          />
          <SVGs.Repeat
            className={`action 
            ${Actions.includes("PowerReset") ? "" : "disabled"}
          `}
            size={"35"}
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
            <Modal.Header
              style={{ direction: Interface.i18n.GetLangDirection() }}
            >
              <Modal.Title>{Interface.i18n.T("Are you sure?")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h6 style={{ direction: Interface.i18n.GetLangDirection() }}>
                {currentActionToDo === "VmSuspend"
                  ? Interface.i18n.T(
                      "You are about to Suspend (Hibernate) your server..."
                    )
                  : currentActionToDo === "PowerOff"
                  ? Interface.i18n.T(
                      "You are about to Power off your server..."
                    )
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
        </div>
      </div>
    </>
  );
}

function StatusPill(props) {
  const { vmDetails } = props;

  var color = "#1b55e2";
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
    <span
      className={`mx-2 badge rounded-pill`}
      style={{ backgroundColor: color }}
    >
      {Interface.i18n.T(vmDetails.Status)}{" "}
      {vmDetails.Status === "pending" ? (
        <Loader flat width={"20"} />
      ) : undefined}
    </span>
  );
}

export default QuickActions_Modern;
