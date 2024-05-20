import { Locale } from "@root/i18n.config";
import ChatBotPage from "@/routes/ChatBotPage";

export default function Page({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return <ChatBotPage lang={lang} />;
}