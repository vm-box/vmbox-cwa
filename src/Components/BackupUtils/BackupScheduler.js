import React from "react";
import { InputGroup, Button } from "react-bootstrap";
import SVGs from "../../assets/SVGs";
import Interface from "../../Interface";

function BackupScheduler(props) {
  const { backup, onSubmit, BackupSchedule } = props;

  const [backupScheduleStr, setBackupScheduleStr] =
    React.useState(BackupSchedule);

  var setUtcOffsetSetter = () => {};
  const [utcOffset, setUtcOffset] = React.useState(
    Interface.Utils.Time.GetUTC_Offset((newUtc) => {
      setUtcOffsetSetter(newUtc);
    })
  );
  React.useEffect(() => {
    setUtcOffsetSetter = (newUtc) => setUtcOffset(newUtc);
  }, []);

  var checkpoints = `${backupScheduleStr}`.split(",");
  checkpoints = checkpoints
    .map((s) => {
      var c = s.split(":"); // year:3m-5d-16h-0m
      if (c.length !== 2) return false;
      return {
        onceIn: c[0],
        at: Str_to_At(c[1], utcOffset),
      };
    })
    .filter((c) => c !== false);

  return (
    <div>
      <p className={`d-flex justify-content-between`}>
        <Interface.ToolTip
          title={Interface.i18n.T(`Double click to reload`)}
          tooltip={{ delayShow: "500", place: "left" }}
        >
          <span
            className={`badge badge-secondary`}
            style={{
              cursor: "pointer",
              userSelect: "none",
              backgroundColor: "#1b55e2",
            }}
            onDoubleClick={() => {
              if (utcOffset === null) return;
              setUtcOffset(null);
              Interface.Utils.Time.ReLoadUtcOffset(true, (newUtc) => {
                setUtcOffset(newUtc);
              });
            }}
          >
            {Interface.i18n.T("Your Timezone")}:{" "}
            {utcOffset ? (
              <>
                {utcOffset > 0 ? "+" : utcOffset < 0 ? "-" : ""}
                {utcOffset < 10 ? "0" : ""}
                {parseInt(utcOffset)}:
                {(utcOffset - parseInt(utcOffset)) * 60 < 10 ? "0" : ""}
                {(utcOffset - parseInt(utcOffset)) * 60}
              </>
            ) : (
              "Loading..."
            )}
          </span>
        </Interface.ToolTip>
      </p>
      <InputGroup className={`mb-4 d-flex justify-content-center`}>
        <Interface.ToolTip
          spanClassName={"d-flex"}
          title={Interface.i18n.T("New Checkpoint")}
          tooltip={{ multiline: true }}
        >
          <Button
            variant={"outline-info"}
            onClick={() => {
              var arr = [
                `year:2M-15d-19h-30m`,
                ...checkpoints.map(
                  (c) => `${c.onceIn}:${At_to_Str(c.at, utcOffset)}`
                ),
              ];
              setBackupScheduleStr(arr.join(","));
            }}
            style={{
              padding: "0.5rem 0.8rem",
              borderTopRightRadius: "0",
              borderBottomRightRadius: "0",
              borderRight: "none",
            }}
          >
            <SVGs.CircleAdd />
          </Button>
        </Interface.ToolTip>

        <InputGroup.Text style={{ borderLeft: "none" }}>
          {Interface.i18n.T("Click to Add checkpoint")}
        </InputGroup.Text>
      </InputGroup>

      {checkpoints.map((c, i) => (
        <Checkpoint
          Id={`${backup.Id}_${i}`}
          checkpoint={c}
          key={i}
          onIconClick={() => {
            setBackupScheduleStr(
              checkpoints
                .filter((c, index) => index !== i)
                .map((c) => `${c.onceIn}:${At_to_Str(c.at, utcOffset)}`)
                .join(",")
            );
          }}
          onChange={(newC) => {
            setBackupScheduleStr(
              checkpoints
                .map((c, index) =>
                  index === i
                    ? `${newC.onceIn}:${At_to_Str(newC.at, utcOffset)}`
                    : `${c.onceIn}:${At_to_Str(c.at, utcOffset)}`
                )
                .join(",")
            );
          }}
          Icon={<SVGs.RecycleBin />}
        />
      ))}

      <div className={`d-flex justify-content-center`}>
        {BackupSchedule !== backupScheduleStr ? (
          <Button
            variant={"primary"}
            size={"sm"}
            onClick={() => {
              if (onSubmit && typeof onSubmit === "function") {
                onSubmit(backupScheduleStr);
              }
            }}
          >
            {Interface.i18n.T("Submit Changes")}
          </Button>
        ) : undefined}
      </div>
    </div>
  );
}

function Checkpoint(props) {
  const { Id, checkpoint, onIconClick, Icon, onChange } = props;

  var at = checkpoint.at;
  var month = "",
    day = "",
    hour = "",
    minute = "";
  for (var i = 0; i < at.length; i++) {
    if (at[i].endsWith("M")) {
      var t_month = at[i].replace("M", "");
      if (t_month !== "") {
        month = t_month;
      }
    } else if (at[i].endsWith("d")) {
      var t_day = at[i].replace("d", "");
      if (t_day !== "") {
        day = t_day;
      }
    } else if (at[i].endsWith("h")) {
      var t_hour = at[i].replace("h", "");
      if (t_hour !== "") {
        hour = t_hour;
      }
    } else if (at[i].endsWith("m")) {
      var t_min = at[i].replace("m", "");
      if (t_min !== "") {
        minute = t_min;
      }
    }
  }
  const paramsObj = React.useRef({
    day: day,
    month: month,
  });
  paramsObj.current.day = day;
  paramsObj.current.month = month;

  React.useEffect(() => {
    window.flatpickr(document.getElementById(`${Id}_at_dateTime`), {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      defaultDate: `${hour}:${minute}`,
      static: true,
      onChange: function (selectedDates, dateStr, instance) {
        var newAt = [];
        if (checkpoint.onceIn === "year") {
          newAt.push(`${paramsObj.current.month}M`);
        }
        if (
          checkpoint.onceIn === "year" ||
          checkpoint.onceIn === "month" ||
          checkpoint.onceIn === "week"
        ) {
          newAt.push(`${paramsObj.current.day}d`);
        }
        newAt.push(`${selectedDates[0].getHours()}h`);
        newAt.push(`${selectedDates[0].getMinutes()}m`);
        onChange({
          onceIn: checkpoint.onceIn,
          at: newAt,
        });
      },
    });
  }, [checkpoint.onceIn]);

  var fixed = false;
  if (checkpoint.onceIn === "year") {
    if (month === "") {
      month = "1";
      fixed = true;
    }
    if (day === "") {
      day = "1";
      fixed = true;
    }
  } else if (checkpoint.onceIn === "month") {
    if (day === "") {
      day = "1";
      fixed = true;
    }
  } else if (checkpoint.onceIn === "week") {
    var D = Number(day);
    if (D > 7 || isNaN(D) || day === "") {
      day = "1";
      fixed = true;
    }
  }
  if (fixed) {
    var newAt = [];
    if (checkpoint.onceIn === "year") {
      newAt.push(`${month}M`);
    }
    if (
      checkpoint.onceIn === "year" ||
      checkpoint.onceIn === "month" ||
      checkpoint.onceIn === "week"
    ) {
      newAt.push(`${day}d`);
    }
    newAt.push(`${hour}h`);
    newAt.push(`${minute}m`);
    onChange({
      onceIn: checkpoint.onceIn,
      at: newAt,
    });
  }

  return (
    <div
      className={`d-flex justify-content-center mb-2`}
      style={{ flexWrap: "wrap" }}
    >
      <InputGroup className={`mb-1 w-auto`}>
        <Interface.ToolTip
          spanClassName={"d-flex"}
          title={Interface.i18n.T("Click to Remove")}
          tooltip={{ multiline: true }}
        >
          <Button
            variant={`outline-danger`}
            onClick={onIconClick}
            style={{
              padding: "0.5rem 0.8rem",
              borderTopRightRadius: "0",
              borderBottomRightRadius: "0",
              borderRight: "none",
            }}
          >
            {Icon}
          </Button>
        </Interface.ToolTip>

        <InputGroup.Text style={{ borderLeft: "none" }}>
          <Interface.ToolTip
            tooltip={{ delayShow: "1000" }}
            title={Interface.i18n.T("Checkpoint period")}
          >
            {Interface.i18n.T("Once a")}
          </Interface.ToolTip>
        </InputGroup.Text>
        <select
          id={`${Id}_select`}
          value={checkpoint.onceIn}
          className={`btn btn-outline-primary`}
          data-width={"110px"}
          onChange={(e) => {
            var newAt = [];
            if (e.target.value === "year") {
              newAt.push(`${month}M`);
            }
            if (
              e.target.value === "year" ||
              e.target.value === "month" ||
              e.target.value === "week"
            ) {
              newAt.push(`${day}d`);
            }
            newAt.push(`${hour}h`);
            newAt.push(`${minute}m`);
            onChange({
              onceIn: e.target.value,
              at: newAt,
            });
          }}
        >
          <option value={"year"}>{Interface.i18n.T("year")}</option>
          <option value={"month"}>{Interface.i18n.T("month")}</option>
          <option value={"week"}>{Interface.i18n.T("week")}</option>
          <option value={"day"}>{Interface.i18n.T("day")}</option>
        </select>
      </InputGroup>
      {checkpoint.onceIn === "year" ? (
        <InputGroup className={`mb-1 w-auto`}>
          <InputGroup.Text className={`ml-2`}>
            <Interface.ToolTip
              tooltip={{ delayShow: "1000" }}
              title={"the Backup date and time"}
            >
              {Interface.i18n.T("At")}
            </Interface.ToolTip>
          </InputGroup.Text>
          <select
            id={`${Id}_at_month_select`}
            value={`${month}M`}
            className={`btn btn-outline-primary`}
            data-width={"140px"}
            placeholder={`Select`}
            data-size={"4"}
            onChange={(e) => {
              var newAt = [];
              if (checkpoint.onceIn === "year") {
                newAt.push(`${e.target.value}`);
              }
              if (
                checkpoint.onceIn === "year" ||
                checkpoint.onceIn === "month" ||
                checkpoint.onceIn === "week"
              ) {
                newAt.push(`${day}d`);
              }
              newAt.push(`${hour}h`);
              newAt.push(`${minute}m`);
              onChange({
                onceIn: checkpoint.onceIn,
                at: newAt,
              });
            }}
          >
            <option value={"1M"}>{Interface.i18n.T("January")}</option>
            <option value={"2M"}>{Interface.i18n.T("February")}</option>
            <option value={"3M"}>{Interface.i18n.T("March")}</option>
            <option value={"4M"}>{Interface.i18n.T("April")}</option>
            <option value={"5M"}>{Interface.i18n.T("May")}</option>
            <option value={"6M"}>{Interface.i18n.T("June")}</option>
            <option value={"7M"}>{Interface.i18n.T("July")}</option>
            <option value={"8M"}>{Interface.i18n.T("August")}</option>
            <option value={"9M"}>{Interface.i18n.T("September")}</option>
            <option value={"10M"}>{Interface.i18n.T("October")}</option>
            <option value={"11M"}>{Interface.i18n.T("November")}</option>
            <option value={"12M"}>{Interface.i18n.T("December")}</option>
          </select>
        </InputGroup>
      ) : undefined}

      <InputGroup className={`mb-1 mx-1 w-auto`}>
        {checkpoint.onceIn === "year" ||
        checkpoint.onceIn === "month" ||
        checkpoint.onceIn === "week" ? (
          <>
            <InputGroup.Text>
              <Interface.ToolTip
                delay={1000}
                title={Interface.i18n.T("the Day number and time of backup")}
              >
                {checkpoint.onceIn === "week"
                  ? Interface.i18n.T("Weekday and Time")
                  : Interface.i18n.T("Day of the month and Time")}
                :
              </Interface.ToolTip>
            </InputGroup.Text>
            {checkpoint.onceIn === "week" ? (
              <>
                <span>
                  <select
                    id={`${Id}_at_week_select`}
                    value={`${day}d`}
                    className={`btn btn-outline-primary`}
                    data-width={"140px"}
                    data-size={"4"}
                    placeholder={"Select a Day"}
                    style={{ height: "100%" }}
                    onChange={(e) => {
                      var newAt = [];
                      if (checkpoint.onceIn === "year") {
                        newAt.push(`${month}M`);
                      }
                      if (
                        checkpoint.onceIn === "year" ||
                        checkpoint.onceIn === "month" ||
                        checkpoint.onceIn === "week"
                      ) {
                        newAt.push(e.target.value);
                      }
                      newAt.push(`${hour}h`);
                      newAt.push(`${minute}m`);
                      onChange({
                        onceIn: checkpoint.onceIn,
                        at: newAt,
                      });
                    }}
                  >
                    <option value={"1d"}>{Interface.i18n.T("Sunday")}</option>
                    <option value={"2d"}>{Interface.i18n.T("Monday")}</option>
                    <option value={"3d"}>{Interface.i18n.T("Tuesday")}</option>
                    <option value={"4d"}>
                      {Interface.i18n.T("Wednesday")}
                    </option>
                    <option value={"5d"}>{Interface.i18n.T("Thursday")}</option>
                    <option value={"6d"}>{Interface.i18n.T("Friday")}</option>
                    <option value={"7d"}>{Interface.i18n.T("Saturday")}</option>
                  </select>
                </span>
              </>
            ) : undefined}{" "}
            {checkpoint.onceIn !== "week" ? (
              <input
                className="form-control hiddenNumberArrow"
                placeholder={"Day #"}
                value={day}
                onChange={(e) => {
                  var newDay = e.target.value;
                  if (newDay !== "" && newDay.toLowerCase() !== "e") {
                    var N = Number(newDay);
                    if (isNaN(N) || N < 1 || N > 31) {
                      return;
                    }
                  }
                  var newAt = [];
                  if (checkpoint.onceIn === "year") {
                    newAt.push(`${month}M`);
                  }
                  if (
                    checkpoint.onceIn === "year" ||
                    checkpoint.onceIn === "month" ||
                    checkpoint.onceIn === "week"
                  ) {
                    newAt.push(`${newDay}d`);
                  }
                  newAt.push(`${hour}h`);
                  newAt.push(`${minute}m`);
                  onChange({
                    onceIn: checkpoint.onceIn,
                    at: newAt,
                  });
                }}
                style={{ width: "100px", flexGrow: "unset" }}
              />
            ) : undefined}
          </>
        ) : undefined}

        <span className={`d-flex`} style={{ height: "100%" }}>
          <input
            id={`${Id}_at_dateTime`}
            className="form-control"
            placeholder={Interface.i18n.T("Select Date & Time")}
            type={"text"}
            readOnly={true}
            style={{
              width: "100px",
              height: "100%",
              textAlign: "center",
              flexGrow: "unset",
            }}
          />
        </span>
      </InputGroup>
      <div className={`w-100 d-flex justify-content-center`}>
        <div
          className={`w-50 my-2`}
          style={{
            height: "1px",
            backgroundColor: "#aaaaaa8a",
          }}
        ></div>
      </div>
    </div>
  );
}

function At_to_Str(at, utc_offset) {
  var month = false;
  var day = false;
  var hour = false;
  var min = false;
  for (var i = 0; i < at.length; i++) {
    if (at[i].endsWith("M")) {
      var t_month = at[i].replace("M", "");
      if (t_month !== "") {
        month = t_month.length < 2 ? `0${t_month}` : t_month;
      }
    } else if (at[i].endsWith("d")) {
      var t_day = at[i].replace("d", "");
      if (t_day !== "") {
        day = t_day.length < 2 ? `0${t_day}` : t_day;
      }
    } else if (at[i].endsWith("h")) {
      var t_hour = at[i].replace("h", "");
      if (t_hour !== "") {
        hour = t_hour.length < 2 ? `0${t_hour}` : t_hour;
      }
    } else if (at[i].endsWith("m")) {
      var t_min = at[i].replace("m", "");
      if (t_min !== "") {
        min = t_min.length < 2 ? `0${t_min}` : t_min;
      }
    }
  }
  var lct = Date.parse(
    formatDateStr(new Date().getFullYear(), month, day, hour, min)
  );
  lct = new Date(lct - utc_offset * 3600 * 1000);
  var arr = [];
  if (month) {
    arr.push(`${lct.getUTCMonth() + 1}M`);
  }
  if (day) {
    arr.push(`${lct.getUTCDate()}d`);
  }
  if (hour) {
    arr.push(`${lct.getUTCHours()}h`);
  }
  if (min) {
    arr.push(`${lct.getUTCMinutes()}m`);
  }
  return arr.join("-");
}

function Str_to_At(str, utc_offset) {
  var month = false;
  var day = false;
  var hour = false;
  var min = false;
  var arr = str.split("-");
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].endsWith("M")) {
      var t_month = arr[i].replace("M", "");
      if (t_month !== "") {
        month = t_month.length < 2 ? `0${t_month}` : t_month;
      }
    } else if (arr[i].endsWith("d")) {
      var t_day = arr[i].replace("d", "");
      if (t_day !== "") {
        day = t_day.length < 2 ? `0${t_day}` : t_day;
      }
    } else if (arr[i].endsWith("h")) {
      var t_hour = arr[i].replace("h", "");
      if (t_hour !== "") {
        hour = t_hour.length < 2 ? `0${t_hour}` : t_hour;
      }
    } else if (arr[i].endsWith("m")) {
      var t_min = arr[i].replace("m", "");
      if (t_min !== "") {
        min = t_min.length < 2 ? `0${t_min}` : t_min;
      }
    }
  }
  var lct = Date.parse(
    formatDateStr(new Date().getFullYear(), month, day, hour, min)
  );
  lct = new Date(lct + utc_offset * 3600 * 1000);
  var arr = [];
  if (month) {
    arr.push(`${lct.getUTCMonth() + 1}M`);
  }
  if (day) {
    arr.push(`${lct.getUTCDate()}d`);
  }
  if (hour) {
    arr.push(`${lct.getUTCHours()}h`);
  }
  if (min) {
    arr.push(`${lct.getUTCMinutes()}m`);
  }
  return arr;
}

function formatDateStr(year, month, day, hour, min) {
  month = Number(month && month !== "" ? month : "01");
  day = Number(day && day !== "" ? day : "01");
  hour = Number(hour && hour !== "" ? hour : "00");
  min = Number(min && min !== "" ? min : "00");

  if (month > 12) month = 12;
  if (day > 31) {
    day = 31;
  }
  if (
    day > 30 &&
    (month === 2 || month === 4 || month === 6 || month === 9 || month === 11)
  ) {
    day = 30;
  }
  if (day > 29 && month === 2) {
    day = 29;
  }
  if (year % 4 !== 0 && day > 28 && month === 2) {
    day = 28;
  }

  return `${year}-${month ? (month < 10 ? `0${month}` : month) : "01"}-${
    day ? (day < 10 ? `0${day}` : day) : "01"
  }T${hour ? (hour < 10 ? `0${hour}` : hour) : "00"}:${
    min ? (min < 10 ? `0${min}` : min) : "00"
  }:00.000+00:00`;
}

export default BackupScheduler;
