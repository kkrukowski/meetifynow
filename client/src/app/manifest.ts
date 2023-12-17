import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MeetifyNow",
    short_name: "MeetifyNow",
    description:
      "MeetifyNow is a simple-to-use meeting scheduling tool that doesn't require logging in. The perfect solution for quick online scheduling!",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
