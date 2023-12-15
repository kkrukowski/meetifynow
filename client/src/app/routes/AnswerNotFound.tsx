import Button from "@/components/Button";
import Heading from "@/components/Heading";
import Title from "@/components/Title";
import Link from "next/link";

export default async function AnswetNotFound({ dict }: { dict: any }) {
  return (
    <div className="flex flex-col justify-center items-center h-full mt-20 mx-10 lg:m-0">
      <Title text={dict.page.answerNotFoundPage.title} />
      <Heading text={dict.page.answerNotFoundPage.heading} />
      <Link href="meet/new">
        <Button text={dict.page.createMeeting.createButton} />
      </Link>
    </div>
  );
}
