import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import AnswerMeeting from "./routes/AnswerMeeting";

const router = createBrowserRouter([
  {
    path: "/meet/:id",
    element: <AnswerMeeting />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
