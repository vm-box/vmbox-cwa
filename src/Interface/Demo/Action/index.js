import EjectIso from "./EjectIso";
import PowerOff from "./PowerOff";
import PowerOn from "./PowerOn";
import PowerReset from "./PowerReset";
import VmSuspend from "./VmSuspend";

function DoAction(wsObj, message) {
  switch (message.Type) {
    case "PowerOn":
      PowerOn(wsObj, message);
      break;
    case "PowerOff":
      PowerOff(wsObj, message);
      break;
    case "PowerReset":
      PowerReset(wsObj, message);
      break;
    case "VmSuspend":
      VmSuspend(wsObj, message);
      break;
    case "EjectISO":
      EjectIso(wsObj, message)
      break;
  }
}

export default DoAction;
