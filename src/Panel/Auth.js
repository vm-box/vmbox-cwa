import React from "react";
import { Modal, Button, InputGroup, FormControl } from "react-bootstrap";
import Interface from "../Interface";
import Loader from "../Components/Loader";

import MessageHandler from "../Interface/MessageHandler";

function Auth(props) {
  const [required, setRequired] = React.useState(false);
  const [requesting, setRequesting] = React.useState(false);

  const [pass, setPass] = React.useState("");

  React.useEffect(() => {
    MessageHandler.On(MessageHandler.MessageTypes.RequirePass, (data) => {
      setRequired(true);
    });
    MessageHandler.On(MessageHandler.MessageTypes.Message, (data) => {
      if (!data || !data.code) return;
      if (data.code === 2002) {
        Interface.Authenticated = true;
        setRequired(false);
        setPass("");
        setRequesting(false);
        Interface.SendCommand(Interface.Commands.GetPanelDetails);
      }
    });
  }, []);

  const Login = () => {
    Interface.SendCommand(Interface.Commands.TryPassword, pass);
    setTimeout(() => {
      if (!Interface.Authenticated) {
        setRequesting(false);
        Interface.Alert.Show(
          Interface.i18n.T("The password is not correct."),
          "error"
        );
      }
    }, 5000);
    setRequesting(true);
  };

  return (
    <>
      <Modal show={required} centered backdrop="static" keyboard={false}>
        <Modal.Header style={{ direction: Interface.i18n.GetLangDirection() }}>
          <Modal.Title>
            {Interface.i18n.T("Authentication Required")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup
            className="mb-3"
            style={{ direction: Interface.i18n.GetLangDirection() }}
          >
            <InputGroup.Text id="basic-addon3">
              {Interface.i18n.T("Password")}:
            </InputGroup.Text>
            <FormControl
              disabled={requesting}
              id="basic-url"
              type={"password"}
              aria-describedby="basic-addon3"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              style={{ direction: "ltr" }}
              onKeyPress={(e) => {
                var keyCode = e.code || e.key;
                if (keyCode === "Enter" || keyCode === "NumpadEnter") {
                  Login();
                }
              }}
            />
          </InputGroup>
          {Interface.Utils.qs.GetQuery("DemoPass") ? (
            <p>Password: {Interface.Utils.qs.GetQuery("DemoPass")}</p>
          ) : undefined}
        </Modal.Body>
        <Modal.Footer>
          {requesting ? (
            <div className={`w-100 d-flex justify-content-center`}>
              <Loader flat />
            </div>
          ) : (
            <Button onClick={Login}>{Interface.i18n.T("Login")}</Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Auth;
