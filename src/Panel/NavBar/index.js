import React from "react";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Button,
  Modal,
  ButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import "bootstrap";
import Interface from "../../Interface";
import logo from "../../assets/logo.png";
import SVGs from "../../assets/SVGs";
import MessageHandler from "../../Interface/MessageHandler";
import Loader from "../../Components/Loader";
import SessionManagement from "./SessionManagement";
import PwaHandler from "./PwaHandler";
import UpdateManager from "./UpdateManager";

function NavBarRoot(props) {
  const { Refresh, changeMachine, onLogout, vmDetails } = props;

  const [fixedPossition, setFixedPossition] = React.useState("top");
  const [allMachines, setAllMachines] = React.useState();
  const [customerDetails, setCustomerDetails] = React.useState();

  React.useEffect(() => {
    if (Interface.Utils.qs.GetQuery("navBottom")) {
      setFixedPossition("bottom");
    }
    MessageHandler.On(MessageHandler.MessageTypes.SetAllMachines, (data) => {
      var parsedData = JSON.parse(data);
      if (!parsedData) parsedData = [];
      if (parsedData.length) {
        setAllMachines(parsedData);
      }
    });
    MessageHandler.On(
      MessageHandler.MessageTypes.SetCustomerDetails,
      (data) => {
        var parsedData = JSON.parse(data);
        setCustomerDetails(parsedData);
      }
    );
  }, []);

  const Logout = () => {
    Interface.Requests.MakeRequest(
      Interface.Requests.RequestTypes.RemoveSession,
      {
        Param: {
          Id: "0",
        },
      },
      {
        ResponseCode: 2004,
        OnlyOnce: true,
        Callback: (content) => {
          if (content === "Session removed") {
            // Interface.Alert.Show(Interface.i18n.T("Done"), "success");
            onLogout();
          } else if (content === "Unauthorized") {
            Interface.Alert.Show(
              Interface.i18n.T("Unauthorized action"),
              "error"
            );
          } else {
            Interface.Alert.Show(content);
          }
        },
      }
    );
  };

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="sm"
        bg={window.currentThemeMode.current}
        variant={window.currentThemeMode.current}
        fixed={fixedPossition === "bottom" ? "bottom" : undefined}
      >
        <Container fluid className={`mx-sm-3`}>
          <Navbar.Brand
            href={window.Defaults.NavBar.LogoHref}
            target={"_blank"}
          >
            {}
            {!window.Defaults.NavBar.HideLogo ? (
              <img
                className={`brandLogo`}
                src={logo}
                style={{ maxHeight: "40px" }}
              />
            ) : undefined}
            {window.Defaults.NavBar.LogoText !== "" ? (
              <h5
                className={`brandName`}
                style={{ display: "inline", marginLeft: "6px" }}
              >
                {window.Defaults.NavBar.LogoText}
              </h5>
            ) : undefined}
          </Navbar.Brand>
          <Nav
            className={"justify-content-center"}
            style={{ flexDirection: "row", flexWrap: "wrap" }}
          >
            {allMachines ? (
              allMachines.length > window.Defaults.NavBar.MaxUnlistedServers ? (
                <NavDropdown title={Interface.i18n.T("Select Server")}>
                  {allMachines.map((m, i) => (
                    <NavDropdown.Item
                      key={i}
                      href=""
                      onClick={changeMachine(m.Id)}
                    >
                      {`${i + 1}. ${m.Hostname} ${
                        m.IpAddress !== "" ? ` ( ${m.IpAddress} )` : ``
                      }`}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              ) : allMachines.length > 1 ? (
                allMachines.map((m, i) => (
                  <Nav.Item
                    key={i}
                    onClick={changeMachine(m.Id)}
                    style={{
                      padding: "0.3rem 0.5rem",
                      cursor: "pointer",
                      borderBottom:
                        vmDetails && vmDetails.VmRecordId === m.Id
                          ? "1px solid #bbb"
                          : "",
                    }}
                  >
                    {m.Hostname}
                  </Nav.Item>
                ))
              ) : undefined
            ) : (
              <span className={`mx-3`}>
                <Loader flat width={"40"} />
              </span>
            )}
          </Nav>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            style={{ marginLeft: "auto" }}
          />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            style={{ flexGrow: "unset" }}
          >
            <Nav className="justify-content-end">
              <PwaHandler
                IsPersistent={
                  customerDetails ? customerDetails.IsPersistent : false
                }
              />
              <NavDropdown
                title={
                  <>
                    {window.Defaults.NavBar.HideFlag ? (
                      <SVGs.Globe style={{ marginTop: "-4px" }} />
                    ) : (
                      <img
                        style={{
                          borderRadius: "50%",
                          width: "23px",
                          height: "23px",
                        }}
                        src={`${window.PublickURL}/assets/flags/${window.currentLanguage.Flag}`}
                      />
                    )}
                    <span
                      className={`d-inline d-sm-none`}
                      style={{ marginLeft: ".2rem" }}
                    >
                      Language
                    </span>
                  </>
                }
              >
                {Interface.i18n.GetAllLangs()
                  ? Interface.i18n.GetAllLangs().map((l, i) => (
                      <NavDropdown.Item
                        key={i}
                        href=""
                        onClick={() => {
                          Interface.i18n.ChangeLanguage(l.Id);
                          Refresh();
                        }}
                      >
                        <img
                          style={{ maxWidth: "25px", marginRight: "8px" }}
                          src={`${window.PublickURL}/assets/flags/${l.Flag}`}
                        />
                        {l.Name}
                      </NavDropdown.Item>
                    ))
                  : undefined}
              </NavDropdown>
              {customerDetails ? (
                <NavDropdown
                  title={
                    <>
                      <SVGs.User style={{ margin: "-4px 2px 0 0" }} size={22} />
                      {window.Defaults.NavBar.UserAlias === "FirstName"
                        ? customerDetails.FirstName
                        : window.Defaults.NavBar.UserAlias === "LastName"
                        ? customerDetails.LastName
                        : window.Defaults.NavBar.UserAlias === "Email"
                        ? customerDetails.Email
                        : window.Defaults.NavBar.UserAlias === "FullName"
                        ? `${customerDetails.FirstName} ${customerDetails.LastName}`
                        : customerDetails.FirstName}
                    </>
                  }
                >
                  <NavDropdown.Item>{customerDetails.Email}</NavDropdown.Item>
                  {customerDetails && !customerDetails.IsPersistent ? (
                    <SessionManagement customerDetails={customerDetails} />
                  ) : undefined}

                  <NavDropdown.Item
                    onClick={() => {
                      Interface.Theme.OpenChangeTheme();
                    }}
                  >
                    {Interface.i18n.T("Change Theme")}
                  </NavDropdown.Item>

                  {customerDetails && customerDetails.IsPersistent ? (
                    <>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={Logout}>
                        {Interface.i18n.T("Logout")}
                      </NavDropdown.Item>
                    </>
                  ) : undefined}
                </NavDropdown>
              ) : (
                <Loader flat width={"40"} />
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <UpdateManager />
    </>
  );
}

export default NavBarRoot;
