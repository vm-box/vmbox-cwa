window.currentTheme = { current: null };
window.currentThemeMode = { current: null };

function Setup({ requestedTheme, requestedMode }) {
  if (!window.DefaultTheme) {
    window.DefaultTheme = "classic";
  }
  if (!window.DefaultThemeMode) {
    window.DefaultThemeMode = "light";
  }

  if (
    requestedTheme === "classic" ||
    requestedTheme === "modern" ||
    requestedTheme === "professional"
  ) {
    window.currentTheme.current = requestedTheme;
  } else {
    if (localStorage.getItem("requestedTheme")) {
      window.currentTheme.current = localStorage.getItem("requestedTheme");
    } else {
      window.currentTheme.current = window.DefaultTheme;
    }
  }

  if (requestedMode === "dark" || requestedMode === "light") {
    window.currentThemeMode.current = requestedMode;
  } else {
    if (localStorage.getItem("requestedThemeMode")) {
      window.currentThemeMode.current =
        localStorage.getItem("requestedThemeMode");
    } else {
      window.currentThemeMode.current = window.DefaultThemeMode;
    }
  }

  cleanAllTempCss();
  loadCss(`/themes/all.css`);
  loadCss(`/themes/${window.currentThemeMode.current}.css`);
  loadCss(`/themes/${window.currentTheme.current}/all.css`);
  loadCss(
    `/themes/${window.currentTheme.current}/${window.currentThemeMode.current}.css`
  );
}

function cleanAllTempCss() {
  var header = document.getElementsByTagName("head")[0];
  for (var i = 0; i < header.children.length; i++) {
    if (header.children[i].dataset["vmb"] === "true") {
      header.removeChild(header.children[i]);
    }
  }
}

function loadCss(address) {
  var header = document.getElementsByTagName("head")[0];
  var link = document.createElement("link");
  link.href = `${window.PublickURL}${address}`;
  link.rel = "stylesheet";
  link.type = "text/css";
  link.dataset["vmb"] = "true";
  header.appendChild(link);
}

function ChangeTheme(newTheme) {
  if (
    newTheme !== "classic" &&
    newTheme !== "modern" &&
    newTheme !== "professional"
  )
    return false;
  localStorage.setItem("requestedTheme", newTheme);
  Setup({});
}
function ChangeThemeMode(newThemeMode) {
  if (newThemeMode !== "dark" && newThemeMode !== "light") return false;
  localStorage.setItem("requestedThemeMode", newThemeMode);
  Setup({});
}

function GetThemeAndModeClassName() {
  var ret = "";
  if (!window.currentTheme.current) {
    ret += "unknown_theme classic ";
  } else {
    ret += `theme_${window.currentTheme.current} `;
  }
  if (!window.currentThemeMode.current) {
    ret += "unknown_theme_mode light ";
  } else {
    ret += `theme_mode_${window.currentThemeMode.current} `;
  }

  return ret;
}

function OpenChangeTheme() {}

export default {
  Setup,
  ChangeTheme,
  ChangeThemeMode,
  GetThemeAndModeClassName,
  OpenChangeTheme,
};
