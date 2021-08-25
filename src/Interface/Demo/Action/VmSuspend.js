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
        name: "Suspending",
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
          name: "Suspending",
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
            name: "Suspending",
            percentage: 40,
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
              name: "Suspending",
              percentage: 46,
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
                name: "Suspending",
                percentage: 53,
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
                  name: "Suspending",
                  percentage: 68,
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
                    name: "Suspending",
                    percentage: 72,
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
                      name: "Suspending",
                      percentage: 94,
                      done: false,
                    },
                  ]);
                  window.VmState[`${VmRecordId}`] = "VmSuspended";
                  setTimeout(() => {
                    SendAction(wsObj, message, message.Type, [
                      {
                        name: "Prepairing",
                        percentage: 100,
                        done: true,
                      },
                      {
                        name: "Suspending",
                        percentage: 100,
                        done: true,
                      },
                    ]);
                    setTimeout(() => {
                      wsObj.onmessage({
                        data: JSON.stringify([{ type: "Reload" }]),
                      });
                    }, 50);
                  }, 600);
                }, 400);
              }, 510);
            }, 480);
          }, 420);
        }, 550);
      }, 500);
    }, 500);
  }, 20);
};
