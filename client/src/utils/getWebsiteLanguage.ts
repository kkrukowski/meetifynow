const getWebsiteLanguage = () => {
  const urlLanguage = window.location.pathname.split("/")[1];
  const languages = ["en", "", "pl"];
  const isMeetingPath = window.location.pathname.split("/")[1] === "meet";
  const isBrowserLanguagePl = navigator.language === "pl";

  console.log(isMeetingPath);

  if (urlLanguage === "pl" && isBrowserLanguagePl) {
    return "pl";
  }

  if (languages.includes(urlLanguage)) {
    return urlLanguage;
  } else {
    return "";
  }
};

export default getWebsiteLanguage;
