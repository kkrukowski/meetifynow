import axios from "axios";
import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./i18n";
import "./index.css";
import getWebsiteLanguage from "./utils/getWebsiteLanguage";

// Moment
import moment from "moment";
import "moment/dist/locale/pl";

// Layout
import RootLayout from "./layouts/RootLayout";

// Views
import AnswerMeeting from "./routes/AnswerMeeting";
import AnswerMeetingLoader from "./routes/AnswerMeetingLoader";
import AnswerNotFound from "./routes/AnswerNotFound";
import CreateMeeting from "./routes/CreateMeeting";
import Error404 from "./routes/Error404";
import HomePage from "./routes/HomePage";

export default function App() {
  const [language, setLanguage] = useState(getWebsiteLanguage());

  moment.locale(language === "" ? "en" : language);

  // Redirect to correct language before render AnswerMeeting
  function useLanguageHandler() {
    const { i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
      const isMeetingPath = location.pathname.startsWith("/meet/");
      const urlLanguage = window.location.pathname.split("/")[1];
      const languages = ["en", "pl"];
      const isLanguageInUrl = languages.includes(urlLanguage);
      const browserLanguage = navigator.language;

      if (
        isMeetingPath &&
        !isLanguageInUrl &&
        language !== "pl" &&
        browserLanguage === "pl"
      ) {
        setLanguage("pl");
        i18n.changeLanguage("pl");
        return navigate(location.pathname.replace("/meet/", "/pl/meet/"));
      }
    }, [location, navigate, navigator]);
  }

  function RenderAnswerMeeting() {
    useLanguageHandler();

    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [isMeetingFound, setIsMeetingFound] = useState(false);
    const [meetingData, setMeetingData] = useState<any>({});

    useEffect(() => {
      axios
        .get(import.meta.env.VITE_SERVER_URL + `/meet/${id}`)
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            setMeetingData(res.data);
            setIsMeetingFound(true);
          }
        })
        .catch((err) => {
          console.error(err);
          setIsMeetingFound(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, [id]);

    if (isLoading) {
      return <AnswerMeetingLoader />;
    }

    if (isMeetingFound) {
      return <AnswerMeeting {...meetingData} />;
    }

    return <AnswerNotFound />;
  }

  return (
    <BrowserRouter basename={`/${language}`}>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="meet">
            <Route path="new" element={<CreateMeeting />} />
            <Route path=":id" element={<RenderAnswerMeeting />} />
          </Route>

          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
