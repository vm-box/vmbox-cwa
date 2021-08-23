import React from "react";
import {
  NavDropdown,
  Modal,
  Button,
  Card,
  InputGroup,
  FormControl,
  ButtonGroup,
} from "react-bootstrap";
import Badge from "react-bootstrap/Badge";
import Loader from "../../Components/Loader";
import Interface from "../../Interface";

function SessionManagement(props) {
  const { customerDetails } = props;

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <NavDropdown.Item onClick={() => setOpen(true)}>
        {Interface.i18n.T("Manage Sessions")}
      </NavDropdown.Item>
      <Modal show={open} centered onHide={() => setOpen(false)}>
        <Modal.Header style={{ direction: Interface.i18n.GetLangDirection() }}>
          <Modal.Title>{Interface.i18n.T("Manage Sessions")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewSession />
          {customerDetails && customerDetails.Sessions ? (
            customerDetails.Sessions.map((session, i) => (
              <Session
                key={i}
                index={i + 1}
                customerDetails={customerDetails}
                session={session}
              />
            ))
          ) : (
            <h6 className={`text-center`}>
              {Interface.i18n.T("No Sessions Found")}
            </h6>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpen(false)}>
            {Interface.i18n.T("Close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function NewSession(props) {
  const {} = props;

  const [open, setOpen] = React.useState(false);
  const [newPass, setNewPass] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [requested, setRequested] = React.useState(false);

  const onSubmit = () => {
    setRequested(true);
    Interface.Requests.MakeRequest(
      Interface.Requests.RequestTypes.CreateSession,
      {
        Param: {
          Password: newPass,
          Description: desc,
        },
      },
      {
        OnlyOnce: true,
        ResponseCode: 2001,
        Callback: (content) => {
          if (content === "Session Created") {
            Interface.Alert.Show(Interface.i18n.T("Done"), "success");
          } else if (content === "Session Already Created") {
            Interface.Alert.Show(Interface.i18n.T("Done"), "success");
          }
          setRequested(false);

          // save the latest wsAddress in the localStorage
          localStorage.setItem("wsAddress", window.currentWsAddress);

          var urlWithoutWsAddress = window.location.href.split("?")[0];
          window.location.href = `${urlWithoutWsAddress}`;
        },
      }
    );
  };

  return (
    <>
      <div className={`d-flex justify-content-center my-2`}>
        {requested ? (
          <Loader flat />
        ) : open ? (
          <div>
            <InputGroup
              className="mb-3"
              style={{ direction: Interface.i18n.GetLangDirection() }}
            >
              <InputGroup.Text>
                {Interface.i18n.T("Password (Optional)")}:
              </InputGroup.Text>
              <FormControl
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
            </InputGroup>
            <InputGroup
              className="mb-3"
              style={{ direction: Interface.i18n.GetLangDirection() }}
            >
              <InputGroup.Text>
                {Interface.i18n.T("Description (Optional)")}:
              </InputGroup.Text>
              <FormControl
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </InputGroup>
            <div className={`d-flex justify-content-center`}>
              <ButtonGroup style={{ direction: "ltr" }}>
                <Button
                  variant={"outline-primary"}
                  onClick={() => setOpen(false)}
                >
                  {Interface.i18n.T("Cancel")}
                </Button>
                <Button onClick={onSubmit}>{Interface.i18n.T("Submit")}</Button>
              </ButtonGroup>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            {Interface.i18n.T("Create new Session")}
          </Button>
        )}
      </div>
    </>
  );
}

function Session(props) {
  const { customerDetails, session, index } = props;

  const [newPassShown, setNewPassShown] = React.useState(false);
  const [removePassShown, setRemovePassShown] = React.useState(false);
  const [deleteSessionShown, setDeleteSessionShown] = React.useState(false);
  const [requested, setRequested] = React.useState(false);

  const [newPass, setNewPass] = React.useState("");

  const onNewPassSubmit = () => {
    if (newPass === "") {
      Interface.Alert.Show(
        Interface.i18n.T("Password can not be empty"),
        "error"
      );
    }
    setRequested(true);
    setNewPassShown(false);
    Interface.Requests.MakeRequest(
      Interface.Requests.RequestTypes.SetSessionPass,
      {
        Param: {
          Id: session.Id,
          Password: newPass,
        },
      },
      {
        ResponseCode: 2003,
        OnlyOnce: true,
        Callback: (content) => {
          if (content === "Password set") {
            Interface.Alert.Show(Interface.i18n.T("Done"), "success");
          } else if (content === "Unauthorized") {
            Interface.Alert.Show(
              Interface.i18n.T("Unauthorized action"),
              "error"
            );
          } else {
            Interface.Alert.Show(content);
          }
          setRequested(false);
          setNewPass("");
          Interface.SendCommand(Interface.Commands.GetPanelDetails);
        },
      }
    );
  };
  const onRemovePassSubmit = () => {
    setRequested(true);
    setRemovePassShown(false);
    Interface.Requests.MakeRequest(
      Interface.Requests.RequestTypes.SetSessionPass,
      {
        Param: {
          Id: session.Id,
          Password: "",
        },
      },
      {
        ResponseCode: 2003,
        OnlyOnce: true,
        Callback: (content) => {
          if (content === "Password set") {
            Interface.Alert.Show(Interface.i18n.T("Done"), "success");
          } else if (content === "Unauthorized") {
            Interface.Alert.Show(
              Interface.i18n.T("Unauthorized action"),
              "error"
            );
          } else {
            Interface.Alert.Show(content);
          }
          setRequested(false);
          Interface.SendCommand(Interface.Commands.GetPanelDetails);
        },
      }
    );
  };
  const onDeleteSessionSubmit = () => {
    setRequested(true);
    setDeleteSessionShown(false);
    Interface.Requests.MakeRequest(
      Interface.Requests.RequestTypes.RemoveSession,
      {
        Param: {
          Id: session.Id,
        },
      },
      {
        ResponseCode: 2004,
        OnlyOnce: true,
        Callback: (content) => {
          if (content === "Session removed") {
            Interface.Alert.Show(Interface.i18n.T("Done"), "success");
          } else if (content === "Unauthorized") {
            Interface.Alert.Show(
              Interface.i18n.T("Unauthorized action"),
              "error"
            );
          } else {
            Interface.Alert.Show(content);
          }
          setRequested(false);
          Interface.SendCommand(Interface.Commands.GetPanelDetails);
        },
      }
    );
  };

  return (
    <Card
      className={`mb-2`}
      body
      style={{
        fontSize: "14px",
        direction: Interface.i18n.GetLangDirection(),
      }}
    >
      <h5
        className={`mx-1 mb-2 d-flex justify-content-between`}
        style={{ flexWrap: "wrap" }}
      >
        <span>{`${index}. ${session.Description}`}</span>
        {session.HasPassword ? (
          <span className={`badge rounded-pill bg-info`}>
            {Interface.i18n.T("Requires Password")}
          </span>
        ) : undefined}
        {session.IsCurrentSession ? (
          <span className={`badge rounded-pill bg-info`}>
            {Interface.i18n.T("Current Session")}
          </span>
        ) : undefined}
      </h5>
      <div>
        <b>{Interface.i18n.T("Created at")}: </b>
        {Interface.Utils.Time.UnixToDateString(session.CreatedDate)}
      </div>
      <div>
        <b>{Interface.i18n.T("Last seen at")}: </b>
        <span style={{ direction: "ltr" }}>
          {Interface.Utils.Time.UnixToDateString(session.LastSeen)}
        </span>
      </div>
      <div style={{ direction: "ltr" }}>
        <b>User Agent: </b>
        <span style={{ fontSize: "12px" }}>{session.UserAgent}</span>
      </div>
      <div style={{ direction: "ltr" }}>
        <b>IP Address: </b>
        <span style={{ fontSize: "12px" }}>{session.RemoteIp}</span>
      </div>

      {requested ? (
        <div className={`d-flex justify-content-center mt-3 mb-2`}>
          <Loader flat />
        </div>
      ) : newPassShown ? (
        <>
          <InputGroup
            className="mt-3 mb-2"
            style={{ direction: Interface.i18n.GetLangDirection() }}
          >
            <InputGroup.Text>{Interface.i18n.T("Password")}:</InputGroup.Text>
            <FormControl
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              style={{ direction: "ltr" }}
              onKeyPress={(e) => {
                var keyCode = e.code || e.key;
                if (keyCode === "Enter" || keyCode === "NumpadEnter") {
                  onNewPassSubmit();
                }
              }}
            />
          </InputGroup>
          <div className={`d-flex justify-content-center`}>
            <ButtonGroup style={{ direction: "ltr" }}>
              <Button
                variant={"outline-primary"}
                onClick={() => setNewPassShown(false)}
              >
                {Interface.i18n.T("Cancel")}
              </Button>
              <Button onClick={onNewPassSubmit}>
                {Interface.i18n.T("Submit")}
              </Button>
            </ButtonGroup>
          </div>
        </>
      ) : removePassShown ? (
        <>
          <h6 className={`text-center mt-3`}>
            {Interface.i18n.T("Are you sure you want to remove the password?")}
          </h6>
          <div className={`d-flex justify-content-center`}>
            <ButtonGroup style={{ direction: "ltr" }}>
              <Button
                variant={"outline-primary"}
                onClick={() => setRemovePassShown(false)}
              >
                {Interface.i18n.T("No")}
              </Button>
              <Button onClick={onRemovePassSubmit}>
                {Interface.i18n.T("Yes")}
              </Button>
            </ButtonGroup>
          </div>
        </>
      ) : deleteSessionShown ? (
        <>
          <h6 className={`text-center mt-3`}>
            {Interface.i18n.T("Are you sure you want to delete this session?")}
          </h6>
          <div className={`d-flex justify-content-center`}>
            <ButtonGroup style={{ direction: "ltr" }}>
              <Button
                variant={"outline-primary"}
                onClick={() => setDeleteSessionShown(false)}
              >
                {Interface.i18n.T("No")}
              </Button>
              <Button onClick={onDeleteSessionSubmit}>
                {Interface.i18n.T("Yes")}
              </Button>
            </ButtonGroup>
          </div>
        </>
      ) : (
        <>
          <div
            className={`d-flex justify-content-center mt-2`}
            style={{ flexWrap: "wrap" }}
          >
            <Button
              size={"sm"}
              className={`mx-1 mb-1`}
              variant={"success"}
              onClick={() => setNewPassShown(true)}
            >
              {Interface.i18n.T("Set New Password")}
            </Button>
            {session.HasPassword ? (
              <Button
                size={"sm"}
                className={`mx-1 mb-1`}
                variant={"warning"}
                onClick={() => setRemovePassShown(true)}
              >
                {Interface.i18n.T("Remove Password")}
              </Button>
            ) : undefined}
            <Button
              size={"sm"}
              className={`mx-1 mb-1`}
              variant={"danger"}
              onClick={() => setDeleteSessionShown(true)}
            >
              {Interface.i18n.T("Delete Session")}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

export default SessionManagement;
