import { useNavigate } from "react-router-dom";

const getWebsiteLanguage = () => {
  const navigate = useNavigate();
  const urlLanguage = window.location.pathname.split("/")[1];
  const browserLanguage = navigator.language.split("-")[0];
  const languages = ["en", "", "pl"];

  if (languages.includes(urlLanguage)) {
    return urlLanguage;
  } else {
    return "";
  }
};

export default getWebsiteLanguage;
