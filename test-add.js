import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient("https://secret-donkey-692.convex.cloud");

async function run() {
  const result = await client.mutation("meetings:addAnswer", {
    appointmentId: "c5h2ra9",
    username: "Testowy_Bot",
    dates: [{ meetDate: 1777012200000, isOnline: false }]
  });
  console.log("Mutation result:", result);
}
run().catch(console.error);
