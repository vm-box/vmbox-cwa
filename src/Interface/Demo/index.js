import Interface from "..";
import DoAction from "./Action";
import GetMonitoringData from "./GetMonitoringData";
import GetPanelDetails from "./GetPanelDetails";
import GetPanelScripts from "./GetPanelScripts";
import GetPlanTemplates from "./GetPlanTemplates";
import GetCdDrives from "./GetCdDrives";
import GetVmScreenshot from "./GetVmScreenshot";

function Setup(wsAddress) {
  window.VmState = {};
  var wsObj = {
    authenticated: true,
    onopen: () => {},
    onmessage: ({ data }) => {},
    send: async (message) => {
      message = JSON.parse(message);
      if (!wsObj.authenticated && message.Type !== "TryPassword") {
        return;
      }
      if (message.Type === "GetPanelDetails") {
        GetPanelDetails(wsObj, message);
      } else if (message.Type === "GetVmScreenshot") {
        GetVmScreenshot(wsObj, message);
      } else if (message.Type === "GetMonitoringData") {
        GetMonitoringData(wsObj, message);
      } else if (message.Type === "GetPlanTemplates") {
        GetPlanTemplates(wsObj, message);
      } else if (message.Type === "GetCdDrives") {
        GetCdDrives(wsObj, message);
      } else if (message.Type === "GetPanelScripts") {
        GetPanelScripts(wsObj, message);
      } else if (message.Type === "EditPlanTemplate") {
        setTimeout(() => {
          Interface.Alert.Show(
            "Cannot Reinstall OS in demo version",
            "warning"
          );
        }, 200);
      } else if (message.Type === "ExecScript") {
        setTimeout(() => {
          Interface.Alert.Show(
            "Cannot execute script in demo version",
            "warning"
          );
        }, 200);
      } else if (message.Type === "CreateWMKSTicket") {
        setTimeout(() => {
          wsObj.onmessage({
            data: JSON.stringify([
              {
                type: "Message",
                data: {
                  code: 2005,
                  content: JSON.stringify({
                    Ticket: "no_url",
                    Hostname: "{Server_Hostname}",
                  }),
                },
              },
            ]),
          });
          Interface.Alert.Show(
            "Cannot connect to console in demo version",
            "warning"
          );
        }, 800);
      } else if (message.Type === "TryPassword") {
        var pass = Interface.Utils.qs.GetQuery("DemoPass");
        if (!pass || pass === message.Param) {
          wsObj.authenticated = true;
          setTimeout(() => {
            wsObj.onmessage({
              data: JSON.stringify([
                {
                  type: "Message",
                  data: {
                    code: 2002,
                  },
                },
                {
                  type: "Reload",
                },
              ]),
            });
          }, 500);
        }
      } else {
        switch (message.Type) {
          case "PowerOn":
          case "PowerOff":
          case "PowerReset":
          case "VmSuspend":
          case "EjectISO":
          case "Delete":
          case "Deploy":
            DoAction(wsObj, message);
            break;
          default:
          // unhandled message type
        }
      }
    },
  };
  if (Interface.Utils.qs.GetQuery("DemoPass")) {
    wsObj.authenticated = false;
    setTimeout(() => {
      wsObj.onmessage({
        data: JSON.stringify([
          {
            type: "RequirePass",
          },
        ]),
      });
    }, 800);
  }
  setTimeout(() => {
    wsObj.onopen();
  }, 600);
  return wsObj;
}

export default {
  Setup,
};
