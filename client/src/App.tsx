"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Locale } from "../i18n.config";

import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import "./i18n";
import "./index.css";

// Moment
import moment from "moment";
import "moment/dist/locale/pl";

// Views
import AnswerMeeting from "./routes/AnswerMeeting";
import AnswerMeetingLoader from "./routes/AnswerMeetingLoader";
import AnswerNotFound from "./routes/AnswerNotFound";
import CreateMeeting from "./routes/CreateMeeting";
import Error404 from "./routes/Error404";
import HomePage from "./routes/HomePage";

export default function App({ lang }: { lang: Locale }) {
  moment.locale(lang);

  function RenderAnswerMeeting() {
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [isMeetingFound, setIsMeetingFound] = useState(false);
    const [meetingData, setMeetingData] = useState<any>({});

    useEffect(() => {
      axios
        .get(process.env.NEXT_PUBLIC_SERVER_URL + `/meet/${id}`)
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

    return <AnswerNotFound lang={lang} />;
  }

  return (
    <BrowserRouter basename={`/${lang}`}>
      <Routes>
        <Route path="/">
          <Route index element={<HomePage lang={lang} />} />
          <Route path="meet">
            <Route path="new" element={<CreateMeeting lang={lang} />} />
            <Route path=":id" element={<RenderAnswerMeeting />} />
          </Route>

          <Route path="*" element={<Error404 lang={lang} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
