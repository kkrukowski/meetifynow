import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./index.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";

// Views
import AnswerMeeting from "./routes/AnswerMeeting";
import AnswerNotFound from "./routes/AnswerNotFound";
import CreateMeeting from "./routes/CreateMeeting";
import HomePage from "./routes/HomePage";
import NotFound from "./routes/NotFound";

const router = createBrowserRouter([{
  path: "/", element: <HomePage />, errorElement: <NotFound />, children: [{
    path: "meet/:id", element: <CreateMeeting />
  }, {
    path: "meet", element: <CreateMeeting />
  }
]
}]);


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router}/>
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
