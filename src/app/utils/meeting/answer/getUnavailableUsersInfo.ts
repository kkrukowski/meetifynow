export const getUnavailableUsersInfo = (
  answers: any,
  availableUsers: any[],
) => {
  return answers.filter(
    (answer: any) =>
      !availableUsers.find(
        (user: any) => user.userData.userId === (answer.id || answer.username),
      ),
  );
};
