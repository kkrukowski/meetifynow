const getWebsiteLanguage = () => {
  const urlLanguage = window.location.pathname.split("/")[1];
  const languages = ["en", "", "pl"];

  if (languages.includes(urlLanguage)) {
    return urlLanguage;
  } else {
    return "";
  }
};

export default getWebsiteLanguage;
