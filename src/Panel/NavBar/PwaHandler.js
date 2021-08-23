import React from "react";
import { Button, Modal, InputGroup, FormControl } from "react-bootstrap";
import Loader from "../../Components/Loader";
import Interface from "../../Interface";

window.catchPwaPromptInterval = null;

function PwaHandler(props) {
  const { IsPersistent } = props;

  const [shown, setShown] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [newPass, setNewPass] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [requested, setRequested] = React.useState(false);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (window.catchPwaPromptInterval) {
      clearInterval(window.catchPwaPromptInterval);
    }
    window.catchPwaPromptInterval = setInterval(() => {
      if (window.deferredPwaPrompt) {
        setShown(true);
        if (window.catchPwaPromptInterval) {
          clearInterval(window.catchPwaPromptInterval);
        }
      }
    }, 1000);
  }, []);

  const AddToDesktop = () => {
    if (!window.deferredPwaPrompt) {
      return;
    }
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
          } else if (content === "Session Already Created") {
          } else {
            Interface.Alert.Show(Interface.i18n.T(content), "error");
          }
          setRequested(false);

          // save the latest wsAddress in the localStorage
          localStorage.setItem("wsAddress", window.currentWsAddress);

          window.deferredPwaPrompt.prompt();

          setDone(true);
        },
      }
    );
  };

  return (
    <>
      {shown && !window.matchMedia("(display-mode: standalone)").matches ? (
        <Button
          className={`mx-2`}
          variant="outline-primary"
          onClick={() => {
            if (IsPersistent) {
              window.deferredPwaPrompt.prompt();
              setDone(true);
            }
            setOpen(true);
          }}
        >
          {Interface.i18n.T("Add to Desktop")}
        </Button>
      ) : undefined}

      <Modal show={open} centered backdrop="static" keyboard={false}>
        <Modal.Header style={{ direction: Interface.i18n.GetLangDirection() }}>
          <Modal.Title>{Interface.i18n.T("Just one more step!")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {done ? (
            <p style={{ direction: Interface.i18n.GetLangDirection() }}>
              {Interface.i18n.T(
                "Click Install to create the desktop shortcut..."
              )}
            </p>
          ) : requested ? (
            <div className={`d-flex justify-content-center`}>
              <Loader flat />
            </div>
          ) : (
            <>
              <p className={`mb-2`} style={{ direction: Interface.i18n.GetLangDirection() }}>
                {Interface.i18n.T(
                  "A Session will be created to use in PWA mode. you can set a password and a description to secure it and recognize it from other sessions."
                )}
              </p>
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
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {done ? (
            <Button
              variant={"outline-primary"}
              onClick={() => {
                setOpen(false);
                setDone(false);
                setRequested(false);
              }}
            >
              {Interface.i18n.T("Close")}
            </Button>
          ) : !requested ? (
            <>
              <Button
                variant={"outline-primary"}
                onClick={() => setOpen(false)}
              >
                {Interface.i18n.T("Cancel")}
              </Button>
              <Button onClick={() => AddToDesktop()}>
                {Interface.i18n.T("Install")}
              </Button>
            </>
          ) : undefined}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PwaHandler;
