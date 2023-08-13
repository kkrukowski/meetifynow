import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import AnswerMeeting from "./routes/AnswerMeeting";
import CreateMeeting from "./routes/CreateMeeting";

const router = createBrowserRouter([
  {
    path: "/meet/:id",
    element: <AnswerMeeting />,
  },
  {
    path: "/meet/new",
    element: <CreateMeeting />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
