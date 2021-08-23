// import React from "react";

window.currentLanguage = { current: false, Name: "", Flag: "" };

function Setup(requestedLanguage) {
  if (!window.LANG) return;

  var defaultLanguage = window.LANG.Default;
  if (!defaultLanguage || typeof defaultLanguage !== "string") return;

  // try to find the requested Language
  var requestedLanguageFound = false;
  if (requestedLanguage && typeof requestedLanguage === "string") {
    if (window.LANG[requestedLanguage]) {
      if (typeof window.LANG[requestedLanguage] === "object") {
        defaultLanguage = requestedLanguage;
        requestedLanguageFound = true;
      }
    }
  }

  // try to load the language from localStorage if there is no requested Language
  if (!requestedLanguageFound && localStorage.getItem("defaultLanguage")) {
    if (window.LANG[localStorage.getItem("defaultLanguage")]) {
      if (
        typeof window.LANG[localStorage.getItem("defaultLanguage")] === "object"
      ) {
        defaultLanguage = localStorage.getItem("defaultLanguage");
      }
    }
  }

  if (!window.LANG[defaultLanguage]) {
    return;
  }

  if (typeof window.LANG[defaultLanguage] !== "object") return;

  var langObject = window.LANG[defaultLanguage];

  var keys = Object.keys(langObject);

  // _RTL
  keys = keys.filter((k) => k !== "_RTL");

  keys.sort((a, b) => b.length - a.length);

  window.currentLanguage.current = keys.map((k) => {
    return {
      key: k,
      value: langObject[k],
    };
  });
  window.currentLanguage.Name = window.LANG[defaultLanguage]._Name;
  window.currentLanguage.Flag = window.LANG[defaultLanguage]._Flag;

  // _RTL
  if (langObject._RTL) {
    window.currentLanguage._RTL = true;
  }
}

function T(Text) {
  if (!window.currentLanguage.current) return Text;
  for (var i = 0; i < window.currentLanguage.current.length; i++) {
    if (window.currentLanguage.current[i].key === Text) {
      // _RTL
      // if (window.currentLanguage._RTL) {
      //   return (
      //     <span style={{ direction: "rtl" }}>
      //       {window.currentLanguage.current[i].value}
      //     </span>
      //   );
      // }
      return window.currentLanguage.current[i].value;
    }
  }
  return Text;
}

function ChangeLanguage(newLang) {
  localStorage.setItem("defaultLanguage", newLang);
  Setup();
}

function GetLangDirection() {
  if (window.currentLanguage && window.currentLanguage._RTL) {
    return "rtl";
  }
  return "unset";
}

function GetAllLangs() {
  if (!window.LANG) return;

  return window.LANG._Langs
    .filter((l) => Object.keys(window.LANG).includes(l))
    .map((l) => ({
      Id: l,
      Name: window.LANG[l]._Name,
      Flag: window.LANG[l]._Flag,
    }));
}

export default { Setup, T, ChangeLanguage, GetAllLangs, GetLangDirection };
