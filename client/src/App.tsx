import { Route, Routes } from "react-router-dom";
import AnswerMeeting from "./routes/AnswerMeeting";
import CreateMeeting from "./routes/CreateMeeting";

export default function App() {
  return (
    <Routes>
      <Route path="/meet/:id" element={<AnswerMeeting />} />
      <Route path="/meet/new" element={<CreateMeeting />} />
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}
