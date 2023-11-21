export const getAvailabilityInfo = (answers: any) => {
  const availabilityInfo = answers
    .flatMap((answer: any) => {
      return answer.dates.map((date: any) => ({
        date: date.meetDate,
        userData: { userId: answer.userId, username: answer.username },
        answerData: { isOnline: date.isOnline },
      }));
    })
    .reduce((acc: any, curr: any) => {
      const {
        date,
        userData,
        answerData: { isOnline },
      } = curr;

      acc[date] = acc[date] || { usersInfo: [], onlineCount: 0 };

      acc[date].usersInfo.push({ userData, isOnline });
      acc[date].onlineCount += isOnline ? 1 : 0;

      return acc;
    }, {});

  return availabilityInfo;
};
