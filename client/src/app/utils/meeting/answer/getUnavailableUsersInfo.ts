import { useEffect } from "react";

export const getUnavailableUsersInfo = (answers: any) => {
  const unavailableUsers = answers.filter(
    (answer: any) => answer.dates.length === 0
  );

  const unavailableUsersInfo = unavailableUsers.map((user: any) => ({
    date: null,
    userData: { userId: user.userId, username: user.username },
    answerData: { isOnline: null },
  }));

  return unavailableUsersInfo;
};
