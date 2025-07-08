export const getUnavailableUsersInfo = (answers: any, availableUsers: any[]) => {
  const unavailableUsers = answers.filter(
    (answer: any) => !availableUsers.find((user: any) => user.userData.userId === answer._id)
  )

  console.log(unavailableUsers)

  return unavailableUsers;
};
