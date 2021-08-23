window.Defaults = {
  NavBar: {
    HideLogo: false,
    LogoText: "", // your hosting name, like RasaTelecom
    LogoHref: "", // your hosting address as a link on logo (like https://rasatelecom.com)
    MaxUnlistedServers: 2, // the maximum count of servers shown in the NavBar, if the servers count is more than this number, a dropdown will be shown instead
    HideFlag: false,
    UserAlias: "FirstName", // values can be [ "FirstName", "LastName", "Email", "FullName" ]
  },
  WMKS: {
    /*
      en-US -> English
      ja-JP_106/109 -> Japanese 
      de-DE -> German
      it-IT -> Italian
      es-ES -> Spanish
      pt-PT -> Portuguese
      fr-FR -> French 
      fr-CH -> Swiss-French
      de-CH -> Swiss-German
    */
    DefaultKeyboardLayout: "en-US",
  },
  ClassicPanel: {
    Monitoring: {
      UseAllocatedMemory: false, // use allocated memory as maximum memory usage in the gauge bar
    },
    InstallTab: {
      GroupPlanTemplates: true,
    },
  },
  ModernPanel: {
    Monitoring: {
      UseAllocatedMemory: false,
    },
    InstallSection: {
      GroupPlanTemplates: true,
    },
  },
  ProfessionalPanel: {
    Overview: {
      UseAllocatedMemory: false,
      ShowMultipliedVCore: true,
    },
    Monitoring: {
      UseAllocatedMemory: false,
    },
    InstallTab: {
      GroupPlanTemplates: true,
    },
  },
};
