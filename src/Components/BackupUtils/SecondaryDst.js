import React from "react";
import {
  Form,
  FormCheck,
  FormControl,
  InputGroup,
  Button,
} from "react-bootstrap";
import Interface from "../../Interface";

function SecondaryDst(props) {
  const { vm, backup, Refresh } = props;

  const [address, setAddress] = React.useState(
    backup.SecondaryDstAddress === "Unset" ? "" : backup.SecondaryDstAddress
  );
  const [username, setUsername] = React.useState(
    backup.SecondaryDstAddress === "Hidden"
      ? "Hidden"
      : backup.SecondaryDstUsername
  );
  const [password, setPassword] = React.useState("");
  const [resetPubkey, setResetPubKey] = React.useState(false);

  React.useEffect(() => {
    setAddress(
      backup.SecondaryDstAddress === "Unset" ? "" : backup.SecondaryDstAddress
    );
    setUsername(
      backup.SecondaryDstAddress === "Hidden"
        ? "Hidden"
        : backup.SecondaryDstUsername
    );
    setPassword("");
    setResetPubKey(false);
  }, [backup.SecondaryDstAddress, backup.SecondaryDstUsername]);

  return (
    <>
      <div
        className={`d-flex justify-content-center align-items-center px-4 pt-3`}
        style={{ flexDirection: "column" }}
      >
        <InputGroup
          className={`mb-2`}
          style={{ direction: Interface.i18n.GetLangDirection() }}
        >
          <InputGroup.Text
            style={{ direction: Interface.i18n.GetLangDirection() }}
          >
            {Interface.i18n.T("Server Address")}
            {backup.SecondaryDstAddress === "Unset" ? " (Unset)" : ""}:
          </InputGroup.Text>
          <FormControl
            placeholder={"(ftp|sftp)://IP_Address:[Port]"}
            value={address}
            onChange={(e) => {
              if (address !== "" && e.target.value === "") {
                Interface.Alert.Show(
                  Interface.i18n.T(
                    "Saving empty address will set the secondary destination to the default value."
                  ),
                  "info",
                  5000
                );
              }
              setAddress(e.target.value);
            }}
            style={{ direction: "ltr" }}
          />
        </InputGroup>

        <InputGroup
          className={`mb-2`}
          style={{ direction: Interface.i18n.GetLangDirection() }}
        >
          <InputGroup.Text
            style={{ direction: Interface.i18n.GetLangDirection() }}
          >
            {Interface.i18n.T("Username")}:
          </InputGroup.Text>
          <FormControl
            placeholder={Interface.i18n.T("Username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ direction: "ltr" }}
          />
        </InputGroup>

        <InputGroup
          className={`mb-2`}
          style={{ direction: Interface.i18n.GetLangDirection() }}
        >
          <InputGroup.Text
            style={{ direction: Interface.i18n.GetLangDirection() }}
          >
            {Interface.i18n.T("Password")}:
          </InputGroup.Text>
          <FormControl
            type={"password"}
            placeholder={Interface.i18n.T("Password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ direction: "ltr" }}
          />
        </InputGroup>

        <InputGroup
          className={`mb-2`}
          style={{ direction: Interface.i18n.GetLangDirection() }}
        >
          <InputGroup.Text
            style={{ direction: Interface.i18n.GetLangDirection() }}
          >
            {Interface.i18n.T("Reset Pub-key (only for SFTP servers)")}:
          </InputGroup.Text>
          <InputGroup.Text>
            <Form>
              <FormCheck
                type={"switch"}
                checked={!!resetPubkey}
                onChange={() => {}}
                onClick={() => setResetPubKey(!resetPubkey)}
              />
            </Form>
          </InputGroup.Text>
        </InputGroup>
        <div className={`d-flex justify-content-center`}>
          {backup.SecondaryDstAddress !== address ||
          backup.SecondaryDstUsername !== username ||
          password !== "" ||
          resetPubkey ? (
            <Button
              variant={"primary"}
              onClick={() => {
                var newAddress = address;
                if (address === "" || address === "Unset") {
                  newAddress = "";
                } else if (
                  !address.startsWith("ftp://") &&
                  !address.startsWith("sftp://")
                ) {
                  Interface.Alert.Show(
                    Interface.i18n.T(
                      "Server Address must start with 'ftp://' or 'sftp://'"
                    ),
                    "error"
                  );
                  return;
                } else if (username === "" || password === "") {
                  Interface.Alert.Show(
                    Interface.i18n.T("Username or Password is empty"),
                    "error"
                  );
                  return;
                }
                Interface.SendCommand(
                  Interface.Commands.SetBackupSecondaryDst,
                  {
                    VmBackupId: backup.Id,
                    Address: newAddress,
                    Username: username,
                    Password: password,
                    ResetPubKey: !!resetPubkey,
                  }
                );
                Refresh();
              }}
            >
              {Interface.i18n.T("Save Changes")}
            </Button>
          ) : undefined}
        </div>
      </div>
    </>
  );
}

export default SecondaryDst;
