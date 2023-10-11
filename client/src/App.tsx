import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";

// Views
import AnswerMeeting from "./routes/AnswerMeeting";
import AnswerNotFound from "./routes/AnswerNotFound";
import CreateMeeting from "./routes/CreateMeeting";
import HomePage from "./routes/HomePage";

export default function App() {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route path="/meet/:id" element={<RenderAnswerMeeting />} />
      <Route path="/meet/new" element={<CreateMeeting />} />
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}

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
