import dynamic from "next/dynamic";
import { Locale } from "../../../i18n.config";
import "../../index.css";

const App = dynamic(() => import("../../App"), { ssr: false });

export default function Page({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return <App lang={lang} />;
}
