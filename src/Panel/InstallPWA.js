import React from "react";
import { Modal, InputGroup, FormControl, Button } from "react-bootstrap";
import Loader from "../Components/Loader";
import Interface from "../Interface";
import MessageHandler from "../Interface/MessageHandler";

window.deferredPwaPrompt = null;

function InstallPWA(props) {
  const { vmDetails } = props;

  const waitForPromptTimeout = 10;

  const [hideModal, setHideModal] = React.useState(false);

  const [newPass, setNewPass] = React.useState("");
  const [desc, setDesc] = React.useState("");

  const checkPromptInterval = React.useRef();
  const [catched, setCatched] = React.useState(false);
  const [customerDetails, setCustomerDetails] = React.useState();
  const [checkCount, setCheckCount] = React.useState(0);
  const checkCountObj = React.useRef(0);
  checkCountObj.current = checkCount;

  const [requested, setRequested] = React.useState(false);

  React.useEffect(() => {
    checkPromptInterval.current = setInterval(() => {
      if (window.deferredPwaPrompt) {
        setCatched(true);
        clearInterval(checkPromptInterval.current);
      }
      if (checkCountObj.current > waitForPromptTimeout) {
        clearInterval(checkPromptInterval.current);
        return;
      }
      setCheckCount(checkCountObj.current + 1);
    }, 1000);

    MessageHandler.On(
      MessageHandler.MessageTypes.SetCustomerDetails,
      (data) => {
        var parsedData = JSON.parse(data);
        setCustomerDetails(parsedData);
      }
    );

    return () => {
      clearInterval(checkPromptInterval.current);
    };
  }, []);

  React.useEffect(() => {
    if (catched) {
      var IsPersistent = customerDetails ? customerDetails.IsPersistent : false;
      if (IsPersistent) {
        window.deferredPwaPrompt.prompt().then(() => {
          var urlWithoutWsAddress = window.location.href.split("?")[0];
          window.location.href = `${urlWithoutWsAddress}`;
          setHideModal(true);
        });
        return;
      }
    }
  }, [catched]);

  const createSession = () => {
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
          // save the latest wsAddress in the localStorage
          localStorage.setItem("wsAddress", window.currentWsAddress);
          window.deferredPwaPrompt.prompt().then(() => {
            var urlWithoutWsAddress = window.location.href.split("?")[0];
            window.location.href = `${urlWithoutWsAddress}`;
            setHideModal(true);
          });
          setRequested("Done");
        },
      }
    );
  };

  var forceShown = false;
  if (Interface.Utils.qs.GetQuery("InstallPWA")) {
    if (!window.matchMedia("(display-mode: standalone)").matches) {
      forceShown = true;
    }
  }

  return (
    <>
      <Modal
        show={forceShown && !hideModal}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header style={{ direction: Interface.i18n.GetLangDirection() }}>
          <Modal.Title>{Interface.i18n.T("Just one more step!")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {catched ? (
            customerDetails && customerDetails.IsPersistent ? (
              <p style={{ direction: Interface.i18n.GetLangDirection() }}>
                {Interface.i18n.T(
                  "Click install to create the desktop shortcut..."
                )}
              </p>
            ) : (
              <>
                <p
                  className={`mb-2`}
                  style={{ direction: Interface.i18n.GetLangDirection() }}
                >
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
                <div className={`d-flex justify-content-center`}>
                  {requested ? (
                    requested === "Done" ? (
                      ""
                    ) : (
                      <Loader flat />
                    )
                  ) : (
                    <Button onClick={createSession}>
                      {Interface.i18n.T("Submit and Install")}
                    </Button>
                  )}
                </div>
              </>
            )
          ) : checkCount < waitForPromptTimeout ? (
            <div className={`d-flex justify-content-center py-3`}>
              <Loader flat />
            </div>
          ) : (
            <p style={{ direction: Interface.i18n.GetLangDirection() }}>
              {Interface.i18n.T(
                "Failed to Install the App, the reasons might be"
              )}
              :
              <ul>
                <li>
                  {Interface.i18n.T(
                    "the app is already installed. you can go to chrome://apps in chrome browser or go to settings in other browsers to remove the app."
                  )}
                </li>
                <li>
                  {Interface.i18n.T(
                    `your browser doesn't support PWA or the automatic PWA prompt is disabled. try installing it manually by clicking the options button at the top right corner and click "Install" or "Add to Home Screen" to install the app manually`
                  )}
                </li>
              </ul>
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <>
            <Button
              variant={"outline-primary"}
              onClick={() => {
                if (!catched && checkCount < waitForPromptTimeout) {
                  return;
                }
                if (catched) {
                  var urlWithoutWsAddress = window.location.href.split("?")[0];
                  window.location.href = `${urlWithoutWsAddress}`;
                }
                setHideModal(true);
              }}
            >
              {Interface.i18n.T("Close")}
            </Button>
            {catched && customerDetails && customerDetails.IsPersistent ? (
              <Button
                variant={"primary"}
                onClick={() => {
                  window.deferredPwaPrompt.prompt().then(() => {
                    var urlWithoutWsAddress =
                      window.location.href.split("?")[0];
                    window.location.href = `${urlWithoutWsAddress}`;
                    setHideModal(true);
                  });
                }}
              >
                {Interface.i18n.T("Install")}
              </Button>
            ) : undefined}
          </>
        </Modal.Footer>
      </Modal>
    </>
  );
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  console.log("PWA Prompt preserved");
  window.deferredPwaPrompt = e;
});

export default InstallPWA;
