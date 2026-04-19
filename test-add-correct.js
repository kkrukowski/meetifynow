import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient("https://secret-donkey-692.eu-west-1.convex.cloud");

async function run() {
  const result = await client.mutation("meetings:addAnswer", {
    appointmentId: "c5h2ra9",
    username: "Testowy_Bot2",
    dates: [{ meetDate: 1777012200000, isOnline: false }]
  });
  console.log("Mutation result:", result);
  
  const queryResult = await client.query("meetings:getByAppointmentId", { appointmentId: "c5h2ra9" });
  console.log("Adding answer. Last answer: ", JSON.stringify(queryResult.answers[queryResult.answers.length - 1]));
}
run().catch(console.error);
