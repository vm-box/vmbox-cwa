import React from "react";
import { Modal, Button } from "react-bootstrap";
import Interface from "../../Interface";

function UpdateManager(props) {
  const [shown, setShown] = React.useState(false);

  const upcomingVersion = React.useRef();

  const forceUpdate = () => {
    caches.keys().then((v) =>
      v.forEach((c) => {
        caches
          .open(c)
          .then((d) => d.keys().then((dK) => dK.forEach((k) => d.delete(k))));
      })
    );
    localStorage.setItem(
      "vmb_cwa_ver",
      JSON.stringify(upcomingVersion.current)
    );
    window.location.reload();
  };

  React.useEffect(() => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        try {
          var parsedData = JSON.parse(this.responseText);
          upcomingVersion.current = parsedData;
          var currentVersion = localStorage.getItem("vmb_cwa_ver");
          if (!currentVersion) {
            localStorage.setItem("vmb_cwa_ver", JSON.stringify(parsedData));
            return;
          }
          currentVersion = JSON.parse(currentVersion);
          if (currentVersion.major !== parsedData.major) {
            forceUpdate();
            return;
          }
          if (
            currentVersion.minor !== parsedData.minor ||
            currentVersion.patch !== parsedData.patch
          ) {
            setTimeout(() => {
              var verInfoP = window.$(`#vmb_versionInfo`);
              if (verInfoP) {
                if (parsedData.message_i18n && parsedData.message_i18n !== "") {
                  verInfoP.html(Interface.i18n.T(parsedData.message_i18n));
                } else if (parsedData.message && parsedData.message !== "") {
                  verInfoP.html(parsedData.message);
                }
              } else {
                Interface.Alert.Show("Shit");
              }
            }, 500);
            setShown(true);
          }
        } catch {}
      }
    };
    xhttp.open(
      "GET",
      `${window.PublickURL}/assets/version.json?t=${Number(new Date())}`,
      true
    );
    xhttp.send();
  }, []);

  return (
    <>
      <Modal show={shown} centered onHide={() => setShown(false)}>
        <Modal.Header style={{ direction: Interface.i18n.GetLangDirection() }}>
          <Modal.Title>
            {Interface.i18n.T("A new version is available!")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ direction: Interface.i18n.GetLangDirection() }}>
          <p
            id={"vmb_versionInfo"}
            style={{
              direction: Interface.i18n.GetLangDirection(),
            }}
          ></p>
          {Interface.i18n.T(
            'For updating, click the "Clear the Cache" button and reload the page.'
          )}
          <div className={`d-flex justify-content-center`}>
            <Button className={`my-2`} onClick={() => forceUpdate()}>
              {Interface.i18n.T("Clear the Cache")}
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <>
            <Button
              variant={"outline-primary"}
              onClick={() => {
                setShown(false);
              }}
            >
              {Interface.i18n.T("Close")}
            </Button>
          </>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateManager;
