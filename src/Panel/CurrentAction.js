import React from "react";
import Interface from "../Interface";
import MessageHandler from "../Interface/MessageHandler";

function CurrentActionRoot(props) {
  const [shown, setShown] = React.useState(false);
  const [name, setName] = React.useState("");
  const [currentSteps, setCurrentSteps] = React.useState([]);

  const lastActionDetailsTimeStamp = React.useRef(0);

  React.useEffect(() => {
    MessageHandler.On(MessageHandler.MessageTypes.Action, (data) => {
      const { name, steps } = data;
      if (steps && typeof steps === "string") {
        var newSteps = JSON.parse(steps);
        if (newSteps && newSteps.length) {
          setCurrentSteps(newSteps);
        } else {
          setCurrentSteps([]);
        }
      } else {
        setCurrentSteps(steps);
      }
      lastActionDetailsTimeStamp.current = parseInt(new Date() / 1000);
      setShown(true);
      setName(name);
    });
  }, []);

  if (!shown) return <></>;

  if (
    parseInt(new Date() / 1000) - lastActionDetailsTimeStamp.current > 5 &&
    currentSteps &&
    currentSteps.length &&
    currentSteps[currentSteps.length - 1].done
  ) {
    setShown(false);
  }

  // TODO show only the currently selected vm CurrentAction, not other ones

  return <CurrentAction Name={name} Steps={currentSteps} />;
}

function CurrentAction(props) {
  const { Name, Steps } = props;

  const PrepairingWidth = 20;

  var positionAt = "bottom";
  if (Interface.Utils.qs.GetQuery("navBottom")) {
    positionAt = "top";
  }

  // divide progress width by the length of the name of each step
  var Total = parseFloat(
    Steps.filter((v, i) => i > 0)
      .map((s) => s.name)
      .map((n) =>
        Object.keys(NameSizeExceptions).includes(n) ? NameSizeExceptions[n] : n
      )
      .join("").length
  );
  var currentStart = 0;
  for (var i = 0; i < Steps.length; i++) {
    var name = Steps[i].name;
    if (Object.keys(NameSizeExceptions).includes(name)) {
      name = NameSizeExceptions[name];
    }
    var currentWidth = parseInt(
      (parseFloat(name.length) / Total) * (100 - PrepairingWidth)
    );
    if (i == 0) {
      // First Step is always [PrepairingWidth]%, it's usually Prepairing...
      currentWidth = PrepairingWidth;
    }
    var percentage = Steps[i].percentage;
    percentage = percentage < 1 ? 1 : percentage;
    if (i > 0 && Steps[i - 1].done) {
      percentage = percentage < 20 ? 20 : percentage;
    }
    if (Steps[i].done) percentage = 100;
    percentage = percentage < 0 ? percentage * -1 : percentage;
    Steps[i].NewPercentage = (percentage * currentWidth) / 100;
    Steps[i].color = `${pgColors[i % pgColors.length]}`;
    Steps[i].maxWidth = currentWidth;
    Steps[i].start = currentStart;
    currentStart += currentWidth;
  }

  return (
    <div
      className={`currentAction`}
      style={{
        zIndex: "10000",
        minHeight: "64px",
        borderTop: "1px solid #aaa",
      }}
    >
      <div className={"px-2 py-1"}>{Name}</div>

      {Steps && Steps.length ? (
        <>
          <div
            className="progress progress-bar-stack"
            style={{ marginBottom: "0" }}
          >
            {Steps.map((s, i) => (
              <div
                key={i}
                className={`progress-bar ${
                  s.percentage === 100 || s.done
                    ? ""
                    : "progressing progress-bar-animated"
                } progress-bar-striped `}
                role="progressbar"
                style={{
                  left: `${s.start}%`,
                  width: `${s.NewPercentage}%`,
                  backgroundColor: s.color,
                  position: "sticky",
                }}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            ))}
          </div>

          <div
            className="progress progress-bar-stack"
            style={{ marginBottom: "0", borderRadius: "0" }}
          >
            {Steps.map((s, i) => (
              <div
                key={i}
                className="progress-bar bg-dark progress-bar-animated"
                role="progressbar"
                style={{
                  left: `${s.start}%`,
                  width: `${s.maxWidth}%`,
                  position: "sticky",
                }}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {s.name}
                {s.percentage > 0 && s.percentage < 100 && !s.done
                  ? ` (${s.percentage}%)`
                  : ""}
              </div>
            ))}
          </div>
        </>
      ) : undefined}
    </div>
  );
}

const pgColors = [
  "#2196f3",
  "#5c1ac3",
  "#8dbf42",
  "#e2a03f",
  "#1b55e2",
  "#e7515a",
];

const NameSizeExceptions = {
  Cloning: "111111111111111111111111111111111",
};

export default CurrentActionRoot;
