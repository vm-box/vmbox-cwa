import React from "react";
import { Form, Button } from "react-bootstrap";
import Interface from "../../../Interface";

function Finish(props) {
  const {
    vm,
    backup,
    selectedBackupPlanId,
    selectedSourceBackup,
    restoreOptions,
    setRestoreOptions,
  } = props;

  return (
    <>
      <h4 className={`text-center mt-4 mb-2`} style={{ direction: Interface.i18n.GetLangDirection() }}>
        {Interface.i18n.T("You're about to restore this Backup")}:
      </h4>
      <h4 className={`text-center mb-1`}>
        {Interface.Utils.Time.UnixToDateString(selectedSourceBackup.TimeStamp)}
      </h4>
      <h6 className={`text-center mb-3`} style={{ fontSize: "0.8rem" }}>
        ({new Date(selectedSourceBackup.TimeStamp * 1000).toUTCString()})
      </h6>
      <div className={`d-flex justify-content-center mb-3`}>
        <Form.Check
          type={"checkbox"}
          label={Interface.i18n.T("Power on after Restore")}
          checked={!!restoreOptions.PowerOnAfterRestore}
          onClick={() =>
            setRestoreOptions({
              ...restoreOptions,
              PowerOnAfterRestore: !restoreOptions.PowerOnAfterRestore,
            })
          }
          style={{ direction: Interface.i18n.GetLangDirection() }}
        />
      </div>
    </>
  );
}

export default Finish;
