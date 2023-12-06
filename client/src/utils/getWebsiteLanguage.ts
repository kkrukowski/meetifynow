const getWebsiteLanguage = () => {
  const urlLanguage = window.location.pathname.split("/")[1];
  const languages = ["en", "", "pl"];
  // const isBrowserLanguagePl = navigator.language === "pl";

  if (languages.includes(urlLanguage)) {
    return urlLanguage;
  } else {
    return "";
  }
};

export default getWebsiteLanguage;
