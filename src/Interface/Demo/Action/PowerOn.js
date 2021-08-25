import SendAction from "./SendAction";

export default (wsObj, message) => {
  var VmRecordId = message.VmRecordId;
  window.VmState[`${VmRecordId}`] = "pending";
  setTimeout(() => {
    wsObj.onmessage({
      data: JSON.stringify([{ type: "Reload" }]),
    });
    SendAction(wsObj, message, message.Type, [
      {
        name: "Prepairing",
        percentage: 20,
        done: false,
      },
      {
        name: "PoweringOn",
        percentage: 0,
        done: false,
      },
    ]);
    setTimeout(() => {
      SendAction(wsObj, message, message.Type, [
        {
          name: "Prepairing",
          percentage: 100,
          done: true,
        },
        {
          name: "PoweringOn",
          percentage: 20,
          done: false,
        },
      ]);
      setTimeout(() => {
        SendAction(wsObj, message, message.Type, [
          {
            name: "Prepairing",
            percentage: 100,
            done: true,
          },
          {
            name: "PoweringOn",
            percentage: 55,
            done: false,
          },
        ]);
        window.VmState[`${VmRecordId}`] = "PoweredOn";
        setTimeout(() => {
          SendAction(wsObj, message, message.Type, [
            {
              name: "Prepairing",
              percentage: 100,
              done: true,
            },
            {
              name: "PoweringOn",
              percentage: 100,
              done: true,
            },
          ]);
          setTimeout(() => {
            wsObj.onmessage({
              data: JSON.stringify([{ type: "Reload" }]),
            });
          }, 50);
        }, 300);
      }, 800);
    }, 500);
  }, 20);
};
