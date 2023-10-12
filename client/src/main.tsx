import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useParams,
} from "react-router-dom";
import "./index.css";

// Layout
import RootLayout from "./layouts/RootLayout";

// Views
import AnswerMeeting from "./routes/AnswerMeeting";
import AnswerNotFound from "./routes/AnswerNotFound";
import CreateMeeting from "./routes/CreateMeeting";
import HomePage from "./routes/HomePage";
import NotFound from "./routes/NotFound";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<HomePage />} />
      <Route path="meet">
        <Route path="new" element={<CreateMeeting />} />
        <Route path=":id" element={<RenderAnswerMeeting />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

function RenderAnswerMeeting() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isMeetingFound, setIsMeetingFound] = useState(false);
  const [meetingData, setMeetingData] = useState<any>({});

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_SERVER_URL + `/meet/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setMeetingData(res.data);
          setIsMeetingFound(true);
        }
      })
      .catch((err) => {
        setIsMeetingFound(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <p>Loading..</p>;
  }

  if (isMeetingFound) {
    return <AnswerMeeting {...meetingData} />;
  }

  return <AnswerNotFound />;
}
