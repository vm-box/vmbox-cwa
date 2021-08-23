import React from "react";
import {
  Modal,
  Button,
  InputGroup,
  FormControl,
  Form,
  Tabs,
  Tab,
  Badge,
} from "react-bootstrap";
import Interface from "../../../Interface";
import MessageHandler from "../../../Interface/MessageHandler";
import Loader from "../../../Components/Loader";

function Scripts(props) {
  const { vmDetails } = props;

  const reloadScriptsTimeout = React.useRef();
  const unmountedFlag = React.useRef(false);

  const [scripts, setScripts] = React.useState();
  const scriptsObj = React.useRef(scripts);
  scriptsObj.current = scripts;

  const loadScripts = () => {
    Interface.SendCommand(
      Interface.Commands.GetPanelScripts,
      "",
      vmDetails.VmRecordId
    );
  };

  React.useEffect(() => {
    MessageHandler.On(
      MessageHandler.MessageTypes.ExecScriptResult,
      (data, vmRecordId) => {
        if (`${vmRecordId}` !== `${vmDetails.VmRecordId}`) return;
        if (unmountedFlag.current) return;
        var parsedData = JSON.parse(data);
        if (parsedData.Res !== "success") {
          console.log("ExecScript failed", parsedData.Data);
          Interface.Alert.Show(
            Interface.i18n.T("Error on executing script"),
            "error"
          );
          return;
        }
        var foundScs = scriptsObj.current
          .map((sc, i) => ({ ...sc, Index: i }))
          .filter((sc) => `${sc.ScriptId}` === `${parsedData.ScriptId}`);
        if (foundScs.length > 0) {
          setScripts(
            scriptsObj.current.map((sc, id) =>
              id === foundScs[0].Index
                ? {
                    ...sc,
                    waitingForExecResult: false,
                    defaultTab: "Details",
                  }
                : sc
            )
          );
        }
      }
    );
    MessageHandler.On(
      MessageHandler.MessageTypes.ExecScriptUpdate,
      (data, vmRecordId) => {
        if (`${vmRecordId}` !== `${vmDetails.VmRecordId}`) return;
        if (unmountedFlag.current) return;
        scriptsObj.current.forEach((sc, i) => {
          if (`${sc.ScriptId}` === `${data.ScriptId}`) {
            setScripts(
              scriptsObj.current.map((sc, id) =>
                id === i
                  ? {
                      ...sc,
                      waitingForExecResult: false,
                      LastRun: data,
                    }
                  : sc
              )
            );
          }
        });
      }
    );
    MessageHandler.On(
      MessageHandler.MessageTypes.SetPanelScripts,
      (data, vmRecordId) => {
        if (`${vmRecordId}` !== `${vmDetails.VmRecordId}`) return;
        if (unmountedFlag.current) return;
        var parsedData = JSON.parse(data);
        setScripts(
          parsedData.Scripts.map((sc) => {
            var oldScs = scripts
              ? scripts.filter((oldSc) => oldSc.ScriptId === sc.ScriptId)
              : [];
            if (oldScs.length > 0) {
              return {
                ...sc,
                waitingForExecResult: oldScs[0].waitingForExecResult,
              };
            }
            return sc;
          })
        );
        if (reloadScriptsTimeout.current) {
          clearTimeout(reloadScriptsTimeout.current);
        }
        reloadScriptsTimeout.current = setTimeout(() => loadScripts(), 30000);
      }
    );
    loadScripts();
    return () => {
      if (reloadScriptsTimeout.current) {
        clearTimeout(reloadScriptsTimeout.current);
      }
      unmountedFlag.current = true;
    };
  }, []);

  return (
    <>
      <div className={`d-flex scriptsList`} style={{ flexWrap: "wrap" }}>
        {scripts ? (
          scripts.length > 0 ? (
            scripts.map((sc, i) => (
              <Script key={i} vmDetails={vmDetails} script={sc} />
            ))
          ) : (
            <div className={`text-center w-100 py-4`}>
              {Interface.i18n.T("No Scripts found")}
            </div>
          )
        ) : (
          <Loader style={{ margin: "1rem auto" }} />
        )}
      </div>
    </>
  );
}

function Script(props) {
  const { vmDetails, script } = props;

  const [modalShown, setModalShown] = React.useState(false);

  const Params = React.useRef({});

  const [selectedTab, setSelectedTab] = React.useState(
    script && script.defaultTab && typeof script.defaultTab === "string"
      ? script.defaultTab
      : "Execute"
  );

  const openModal = () => {
    setModalShown(true);
  };

  var started = script && script.LastRun && !script.LastRun.Done;

  var stateClassName = "";
  if (script.LastRun) {
    if (script.LastRun.Done) {
      if (script.LastRun.Failed) {
        stateClassName = "failed";
      } else if (script.LastRun.Canceled) {
        stateClassName = "canceled";
      } else {
        stateClassName = "done";
      }
    } else {
      stateClassName = "active";
    }
  }

  var cbs = "Waiting for stats...";
  if (!script.waitingForExecResult && script.LastRun) {
    cbs = `Script Started at ${Interface.Utils.Time.UnixToDateString(
      script.LastRun.StartTime
    )}\n`;
    if (
      script.LastRun &&
      script.LastRun.Callbacks &&
      script.LastRun.Callbacks.length
    ) {
      script.LastRun.Callbacks.forEach((cb) => {
        cbs =
          cbs +
          `root@${vmDetails.Hostname}:/# ${cb.Type} ${
            cb.Content !== "" ? `(${cb.Content})` : ""
          }\n`;
      });
    }
  }
  var stdOut = "Empty";
  if (script && script.LastRun && script.LastRun.STDOUT) {
    stdOut = script.LastRun.STDOUT;
  }
  var stdErr = "Empty";
  if (script && script.LastRun && script.LastRun.STDERR) {
    stdErr = script.LastRun.STDERR;
  }

  const onStopClicked = () => {
    if (!script || !script.LastRun || script.LastRun.Done) return;
    Interface.SendCommand(
      Interface.Commands.CancelScript,
      `${script.LastRun.ExecId}`,
      vmDetails.VmRecordId
    );
  };

  return (
    <div
      className={`script ${stateClassName}`}
      onClick={() => !modalShown && openModal()}
    >
      <img src={`data:image/png;base64,${script.LogoBase64}`} />
      <span className={`scriptTitle`}>{script.Name}</span>
      <Modal
        show={modalShown}
        className={`${Interface.Theme.GetThemeAndModeClassName()} scriptModal`}
        centered
        onHide={() => setModalShown(false)}
      >
        <Modal.Header>
          <Modal.Title>
            {script.Name}{" "}
            {script.LastRun ? (
              script.LastRun.Failed ? (
                <span
                  className={`badge bg-danger`}
                  style={{ fontSize: "0.9rem" }}
                >
                  {Interface.i18n.T("Failed")}
                </span>
              ) : script.LastRun.Canceled ? (
                <span
                  className={`badge bg-warning`}
                  style={{ fontSize: "0.9rem" }}
                >
                  {Interface.i18n.T("Canceled")}
                </span>
              ) : script.LastRun.Done ? (
                <span
                  className={`badge bg-success`}
                  style={{ fontSize: "0.9rem" }}
                >
                  {Interface.i18n.T("Done")}
                </span>
              ) : (
                <span
                  className={`badge bg-info`}
                  style={{
                    fontSize: "0.9rem",
                    direction: Interface.i18n.GetLangDirection(),
                  }}
                >
                  {Interface.i18n.T("Running...")}
                </span>
              )
            ) : undefined}
          </Modal.Title>
          {started ? (
            <Button
              variant={"outline-danger"}
              size={"sm"}
              onClick={onStopClicked}
            >
              {Interface.i18n.T("Stop")}
            </Button>
          ) : undefined}
          {script.waitingForExecResult ? <Loader width={"30"} /> : undefined}
        </Modal.Header>
        <Modal.Body>
          <div className={`d-flex align-items-center my-2`}>
            <img
              style={{ maxWidth: "75px", maxHeight: "75px" }}
              src={
                script.LogoBase64 !== ""
                  ? `data:image/png;base64,${script.LogoBase64}`
                  : ""
              }
            />
            <p className={`p-2`} style={{ fontSize: ".9rem" }}>
              {script.Desc}
            </p>
          </div>
          <Tabs
            activeKey={selectedTab}
            className="mt-3"
            onSelect={(e) => setSelectedTab(e)}
            style={{ direction: Interface.i18n.GetLangDirection() }}
          >
            <Tab eventKey="Execute" title={Interface.i18n.T("Execute")}>
              <Run
                vmDetails={vmDetails}
                Params={Params}
                script={script}
                started={started}
                onCancel={onStopClicked}
                gotoDetails={() => setSelectedTab("Details")}
              />
            </Tab>
            {script.LastRun || script.waitingForExecResult ? (
              <Tab eventKey="Details" title={Interface.i18n.T("Details")}>
                <textarea
                  style={{
                    width: "100%",
                    border: "none",
                    minHeight: "220px",
                    backgroundColor: "#000",
                    color: "#009688",
                    padding: "10px",
                    fontSize: ".8rem",
                    fontWeight: "500",
                  }}
                  value={cbs}
                  onChange={() => {}}
                ></textarea>
              </Tab>
            ) : undefined}
            {script &&
            script.LastRun &&
            script.LastRun.Done &&
            stdOut &&
            typeof stdOut === "string" &&
            stdOut !== "Empty" ? (
              <Tab eventKey="StdOut" title={Interface.i18n.T("Output")}>
                <textarea
                  style={{
                    width: "100%",
                    border: "none",
                    minHeight: "220px",
                    backgroundColor: "#000",
                    color: "#009688",
                    padding: "10px",
                    fontSize: ".8rem",
                    fontWeight: "500",
                  }}
                  value={stdOut}
                  onChange={() => {}}
                ></textarea>
              </Tab>
            ) : undefined}
            {script &&
            script.LastRun &&
            script.LastRun.Done &&
            stdErr &&
            typeof stdErr === "string" &&
            stdErr !== "Empty" ? (
              <Tab eventKey="StdErr" title={Interface.i18n.T("Error")}>
                <textarea
                  style={{
                    width: "100%",
                    border: "none",
                    minHeight: "220px",
                    backgroundColor: "#000",
                    color: "#009688",
                    padding: "10px",
                    fontSize: ".8rem",
                    fontWeight: "500",
                  }}
                  value={stdErr}
                  onChange={() => {}}
                ></textarea>
              </Tab>
            ) : undefined}
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={"outline-primary"}
            onClick={() => setModalShown(false)}
          >
            {Interface.i18n.T("Close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

function Run(props) {
  const { vmDetails, Params, script, started, onCancel, gotoDetails } = props;

  return (
    <>
      {true && script && script.Params ? (
        <div className={`w-100 p-1`}>
          {script.Params.map((p, i) => {
            if (p.Type === "hidden") {
              Params.current[p.Name] = p.Misc ? p.Misc.HiddenValue : "";
              return undefined;
            }
            return (
              <Param
                param={p}
                key={i}
                onChange={(value) => {
                  Params.current[p.Name] = value;
                }}
              />
            );
          })}
        </div>
      ) : undefined}
      <div className={`d-flex justify-content-center`}>
        <Button
          disabled={started || script.waitingForExecResult}
          onClick={() => {
            if (started) return;
            // check if inputs are correct
            var correct = true;
            if (script.Params && script.Params.length) {
              script.Params.forEach((p) => {
                if (
                  p.Type === "passWithConfirm" &&
                  Params.current[p.Name] === "_NOT_SAME_"
                ) {
                  Interface.Alert.Show(
                    "Password and Repeat Password are not the same.",
                    "warning"
                  );
                  correct = false;
                  return;
                }
                if (
                  p.Required &&
                  (!Params.current[p.Name] || Params.current[p.Name] === "")
                ) {
                  Interface.Alert.Show(`${p.Title} is required.`, "warning");
                  correct = false;
                  return;
                }
              });
            }
            if (!correct) {
              return;
            }

            script.waitingForExecResult = true;
            gotoDetails();

            Interface.SendCommand(Interface.Commands.ExecScript, {
              ScriptId: script.ScriptId,
              Params: Params.current,
            });
          }}
        >
          {Interface.i18n.T("Start")}
        </Button>
        {started ? (
          <Button variant={"outline-danger mx-1"} onClick={onCancel}>
            {Interface.i18n.T("Cancel")}
          </Button>
        ) : undefined}
      </div>
    </>
  );
}

function Param(props) {
  const { param, onChange } = props;
  const {
    Name,
    Type,
    Title,
    Default,
    Desc,
    Required,
    MaxFileSize,
    MaxFileSizeUnit,
    SelectOptions,
    FileType,
  } = param;

  const [value, setValue] = React.useState();
  const [value2, setValue2] = React.useState();

  const uploadFileRef = React.useRef();
  const [selectedFile, setSelectedFile] = React.useState();

  React.useEffect(() => {
    if (selectedFile && selectedFile.name) {
      var sizeStr = `${MaxFileSize}`;
      var sizeByte = MaxFileSize;
      if (MaxFileSizeUnit === "KB") {
        sizeByte = sizeByte * 1024;
        sizeStr = sizeStr + " KB";
      } else if (MaxFileSizeUnit === "MB") {
        sizeByte = sizeByte * 1024 * 1024;
        sizeStr = sizeStr + " MB";
      } else {
        sizeStr = sizeStr + " Byte(s)";
      }
      if (selectedFile.size > sizeByte) {
        Interface.Alert.Show(
          `Selected File is larger than ${sizeStr}`,
          "error"
        );
        setSelectedFile();
        return;
      }
      if (onChange) {
        var fr = new FileReader();
        fr.onloadend = () => {
          var Based64_File = Interface.Utils.ConvertArrayBufferToBase64(
            fr.result
          );
          onChange(Based64_File);
        };
        fr.readAsArrayBuffer(selectedFile);
      }
    }
  }, [selectedFile]);

  React.useEffect(() => {
    if (Default !== "") {
      if (
        Type === "string" ||
        Type === "pass" ||
        Type === "passWithConfirm" ||
        Type === "select"
      ) {
        setValue(Default);
        if (onChange) onChange(`${Default}`);
      } else if (Type === "number") {
        var n = Number(Default);
        if (!isNaN(n)) {
          setValue(n);
          if (onChange) onChange(`${n}`);
        }
      } else if (Type === "bool") {
        var boolVal = Default.toLowerCase().startsWith("t");
        setValue(boolVal);
        if (onChange) onChange(`${boolVal}`);
      }
    }
    if (Type === "select") {
      var selId = `SelectableParam_${Name}`;
      document.getElementById(selId).innerHTML = `${SelectOptions}`;
    }
  }, []);

  if (Type === "string") {
    return (
      <InputGroup className={`mt-2`}>
        <InputGroup.Text>{Title}:</InputGroup.Text>
        <FormControl
          placeholder={Desc}
          value={value}
          onChange={(e) => {
            if (onChange) {
              onChange(`${e.target.value}`);
            }
            setValue(e.target.value);
          }}
        />
      </InputGroup>
    );
  } else if (Type === "number") {
    return (
      <InputGroup className={`mt-2`}>
        <InputGroup.Text>{Title}:</InputGroup.Text>
        <FormControl
          type="number"
          placeholder={Desc}
          value={value}
          onChange={(e) => {
            var n = Number(e.target.value);
            if (onChange && !isNaN(n)) {
              onChange(`${n}`);
            }
            if (!isNaN(n)) setValue(n);
          }}
        />
      </InputGroup>
    );
  } else if (Type === "pass") {
    return (
      <InputGroup className={`mt-2`}>
        <InputGroup.Text>{Title}:</InputGroup.Text>
        <FormControl
          type="password"
          placeholder={Desc}
          value={value}
          onChange={(e) => {
            if (onChange) {
              onChange(`${e.target.value}`);
            }
            setValue(e.target.value);
          }}
        />
      </InputGroup>
    );
  } else if (Type === "passWithConfirm") {
    return (
      <>
        <InputGroup className={`mt-2`}>
          <InputGroup.Text>{Title}:</InputGroup.Text>
          <FormControl
            type="password"
            placeholder={Desc}
            value={value}
            onChange={(e) => {
              if (onChange) {
                if (value2 === e.target.value) {
                  onChange(`${e.target.value}`);
                } else {
                  onChange("_NOT_SAME_");
                }
              }
              setValue(e.target.value);
            }}
          />
        </InputGroup>
        <InputGroup className={`mt-2`}>
          <InputGroup.Text>Repeat:</InputGroup.Text>
          <FormControl
            type="password"
            placeholder={`Repeat your entered Password`}
            value={value2}
            onChange={(e) => {
              if (onChange) {
                if (value === e.target.value) {
                  onChange(`${e.target.value}`);
                } else {
                  onChange("_NOT_SAME_");
                }
              }
              setValue2(e.target.value);
            }}
          />
        </InputGroup>
      </>
    );
  } else if (Type === "bool") {
    return (
      <>
        <InputGroup className={`mt-2 mx-auto d-flex justify-content-center`}>
          <InputGroup.Text>{Title}:</InputGroup.Text>
          <InputGroup.Text
            style={{
              opacity: value === undefined ? "0.4" : "1",
            }}
          >
            <Form.Switch
              type={"switch"}
              checked={value}
              // label={Desc}
              onChange={(e) => {
                if (onChange) {
                  onChange(`${e.target.checked}`);
                }
                setValue(e.target.checked);
              }}
            />
          </InputGroup.Text>
          {Desc && typeof Desc === "string" && Desc.length ? (
            <InputGroup.Text>{Desc}</InputGroup.Text>
          ) : undefined}
        </InputGroup>
      </>
    );
  } else if (Type === "file") {
    return (
      <>
        <InputGroup className={`mt-2 mx-auto d-flex justify-content-center`}>
          <InputGroup.Text>{Title}:</InputGroup.Text>
          <FormControl
            placeholder={Desc}
            value={selectedFile ? selectedFile.name : ""}
          />
          <Button onClick={() => uploadFileRef.current.click()}>Browse</Button>
        </InputGroup>
        <input
          ref={uploadFileRef}
          type="file"
          accept={`${FileType}`}
          onChange={(e) => {
            if (!e.target.files[0]) {
              return;
            }
            var selectedFile = e.target.files[0];
            setSelectedFile(selectedFile);
          }}
          style={{ display: "none" }}
        />
      </>
    );
  } else if (Type === "select") {
    return (
      <>
        <InputGroup className={`mt-2 mx-auto d-flex justify-content-center`}>
          <InputGroup.Text>{Title}:</InputGroup.Text>
          <FormControl placeholder={Desc} value={value} />

          <select
            id={`SelectableParam_${Name}`}
            className="btn btn-outline-primary paramSelect"
            data-width="100%"
            value={value}
            onChange={(e) => {
              if (onChange) {
                onChange(`${e.target.value}`);
              }
              setValue(e.target.value);
            }}
          ></select>
        </InputGroup>
      </>
    );
  }
  return <></>;
}
export default Scripts;
