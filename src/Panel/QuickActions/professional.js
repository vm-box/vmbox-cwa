import React from "react";
import { Modal, ButtonGroup, Button } from "react-bootstrap";
import SVGs from "../../assets/SVGs";
import Loader from "../../Components/Loader";
import Interface from "../../Interface";

function QuickActions_Professional(props) {
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
        className={`px-2 py-1 professionalQuickActions row justify-content-start w-100 ${
          dNone ? "d-none" : ""
        }`}
        style={{ margin: "0" }}
      >
        <div
          className={`serverTitle w-xs-100 w-auto p-2 d-flex justify-content-center align-items-center`}
          style={{
            flexWrap: "wrap",
            fontSize: "1.2rem",
          }}
        >
          <span style={{ color: "#58A6FF" }}>{vmDetails.IpAddress}</span>
          <span className={`mx-1`} style={{ color: "#58A6FF" }}>
            -
          </span>
          <span style={{ color: "#58A6FF" }}>{vmDetails.Hostname}</span>
        </div>
        <span className={`separator d-none d-sm-block`}></span>
        <div
          className={`serverActions col-xs-12 col-sm-auto d-flex justify-content-center align-items-center p-2`}
        >
          {wmksRequested ? (
            <Loader flat width={"30px"} />
          ) : (
            <SVGs.Monitor
              className={`action ${
                vmDetails && vmDetails.Status === "PoweredOn" ? "" : "disabled"
              }`}
              size={"30"}
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
            size={"30"}
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
            size={"30"}
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
            size={"30"}
            style={{ color: "#198754" }}
            onClick={
              Actions.includes("PowerOn") ? DoQuickAction("PowerOn") : () => {}
            }
          />
          <SVGs.Repeat
            className={`action 
            ${Actions.includes("PowerReset") ? "" : "disabled"}
          `}
            size={"30"}
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
        <span className={`separator mx-3 d-none d-sm-block`}></span>
        <div
          className={`col-xs-12 col-sm-auto d-flex justify-content-center align-items-center p-2`}
        >
          <OpenConsoleButton vmDetails={vmDetails} />
        </div>
      </div>
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
        <Loader flat width={"40"} style={{ margin: "12px 0" }} />
      ) : (
        <button
          disabled={!vmDetails || vmDetails.Status !== "PoweredOn"}
          className={`btn btn-link px-1`}
          onClick={onClick}
        >
          {Interface.i18n.T("Open Console in new tab")}
        </button>
      )}
    </>
  );
}

export default QuickActions_Professional;
