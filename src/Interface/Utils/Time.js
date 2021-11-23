import Axios from "axios";

var UTC_offset = null; // Example: +03:30 is 3.5
var utcOffsetGetters = [];

function GetUTC_Offset(cb) {
  cb = cb && typeof cb === "function" ? cb : () => {};
  if (UTC_offset !== null) {
    return UTC_offset;
  }
  utcOffsetGetters.push((newUTC) => {
    cb(newUTC);
  });
  return null;
}

function ReLoadUtcOffset(forceReload, cb) {
  forceReload = !!forceReload;
  cb = cb && typeof cb === "function" ? cb : () => {};
  var localStorageUtc = localStorage.getItem("utc_offset");
  var localStorageUtcUpdateTime = localStorage.getItem("utc_offset_up");
  var tooOld = false;
  if (
    localStorageUtcUpdateTime &&
    Number(new Date()) - Number(localStorageUtcUpdateTime) >
      7 * 24 * 3600 * 1000
  ) {
    tooOld = true;
  }
  if (!localStorageUtcUpdateTime || tooOld || forceReload) {
    Axios.get("https://worldtimeapi.org/api/ip").then((resp) => {
      var timeData = resp.data;
      var [utc_offset_h, utc_offset_m] = timeData.utc_offset.split(":");
      utc_offset_h = Number(utc_offset_h);
      UTC_offset =
        utc_offset_h +
        (utc_offset_h > 0 ? 1 : -1) * (Number(utc_offset_m) / 60);
      localStorage.setItem("utc_offset", `${UTC_offset}`);
      localStorage.setItem("utc_offset_up", `${Number(new Date())}`);
      cb(UTC_offset);
      (async () => {
        utcOffsetGetters.forEach((f) => {
          f(UTC_offset);
        });
        utcOffsetGetters = [];
      })();
    });
  } else {
    if (localStorageUtc) {
      UTC_offset = Number(localStorageUtc);
      cb(UTC_offset);
    }
  }
}

function SecondsToElapsed(Seconds) {
  var a = new Date(Seconds * 1000);
  var seconds = parseInt(Seconds / 1) % 60;
  var minutes = parseInt(Seconds / 60) % 60;
  var hours = parseInt(Seconds / 3600) % 24;
  var days = parseInt((Seconds % (30 * 24 * 3600)) / (24 * 3600)) % 7;
  var weeks = parseInt(Seconds / (7 * 24 * 3600)) % 4;
  if (Seconds / (7 * 24 * 3600) < 1) {
    weeks = 0;
  }
  var months = parseInt((Seconds % (365 * 24 * 3600)) / (30 * 24 * 3600)) % 12;
  if ((Seconds % (365 * 24 * 3600)) / (30 * 24 * 3600) < 1) {
    months = 0;
  }
  var years = parseInt(Seconds / (365 * 24 * 3600));
  if (Seconds / (365 * 24 * 3600) < 1) {
    years = 0;
  }

  var result = "";
  var append = (txt) => {
    result += `${result !== "" ? " " : ""}${txt}`;
  };

  if (years !== 0) {
    append(`${years}year${years === 1 ? "" : "s"}`);
  }
  if (months !== 0) {
    append(`${months}month${months === 1 ? "" : "s"}`);
  }
  if (weeks !== 0) {
    append(`${weeks}week${weeks === 1 ? "" : "s"}`);
  }
  if (days !== 0) {
    append(`${days}day${days === 1 ? "" : "s"}`);
  }
  if (hours !== 0) {
    append(`${hours}h`);
  }
  if (minutes !== 0) {
    append(`${minutes}m`);
  }
  if (seconds !== 0) {
    append(`${seconds}s`);
  }
  return result;
}

function UnixToDateString(UNIX_timestamp, Options) {
  var OnlyDate;
  if (Options) {
    OnlyDate = Options.OnlyDate;
  }
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + " " + month + " " + year;
  if (!OnlyDate) {
    time +=
      " " +
      (hour < 10 ? "0" + hour : hour) +
      ":" +
      (min < 10 ? "0" + min : min) +
      ":" +
      (sec < 10 ? "0" + sec : sec);
  }
  return time;
}

export default {
  SecondsToElapsed,
  UnixToDateString,
  GetUTC_Offset,
  ReLoadUtcOffset,
};
