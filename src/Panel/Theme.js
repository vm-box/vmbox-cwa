import React from "react";
import { Modal, ButtonGroup, Button } from "react-bootstrap";
import Interface from "../Interface";

function Theme(props) {
  const { Refresh } = props;

  const [changeThemeShown, setChangeThemeShown] = React.useState(false);

  Interface.Theme.OpenChangeTheme = () => setChangeThemeShown(true);

  return (
    <>
      <Modal
        show={changeThemeShown}
        centered
        onHide={() => setChangeThemeShown(false)}
      >
        <Modal.Header style={{ direction: Interface.i18n.GetLangDirection() }}>
          <Modal.Title>{Interface.i18n.T("Change Theme")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className={`d-flex justtify-content-center align-items-center`}
            style={{ flexDirection: "column" }}
          >
            <ButtonGroup className="mb-2">
              <Button
                type="radio"
                variant={
                  window.currentTheme.current === "classic"
                    ? "success"
                    : "outline-secondary"
                }
                value={"classic"}
                onClick={() => {
                  Interface.Theme.ChangeTheme("classic");
                  Refresh();
                }}
              >
                {Interface.i18n.T("Classic")}
              </Button>
              <Button
                type="radio"
                variant={
                  window.currentTheme.current === "modern"
                    ? "success"
                    : "outline-secondary"
                }
                value={"modern"}
                onClick={() => {
                  Interface.Theme.ChangeTheme("modern");
                  Refresh();
                }}
              >
                {Interface.i18n.T("Modern")}
              </Button>
              <Button
                type="radio"
                variant={
                  window.currentTheme.current === "professional"
                    ? "success"
                    : "outline-secondary"
                }
                value={"professional"}
                onClick={() => {
                  Interface.Theme.ChangeTheme("professional");
                  Refresh();
                }}
              >
                {Interface.i18n.T("Professional")}
              </Button>
            </ButtonGroup>
            <ButtonGroup className="mb-2">
              <Button
                type="radio"
                variant={
                  window.currentThemeMode.current === "dark"
                    ? "success"
                    : "outline-secondary"
                }
                value={"dark"}
                onClick={() => {
                  Interface.Theme.ChangeThemeMode("dark");
                  Refresh();
                }}
              >
                {Interface.i18n.T("Dark")}
              </Button>
              <Button
                type="radio"
                variant={
                  window.currentThemeMode.current === "light"
                    ? "success"
                    : "outline-secondary"
                }
                value={"light"}
                onClick={() => {
                  Interface.Theme.ChangeThemeMode("light");
                  Refresh();
                }}
              >
                {Interface.i18n.T("Light")}
              </Button>
            </ButtonGroup>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setChangeThemeShown(false)}>
            {Interface.i18n.T("Close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Theme;
