import Image from "next/image";
import Heading from "../Heading";
import SpotlightCard from "../ui/SpotlightCard";

const InfoBlock = (props: {
  img: any;
  img_alt: string;
  img_title: string;
  title: string;
  text: string;
  reverse: boolean;
}) => {
  return (
    <SpotlightCard className="w-full p-10 md:p-16 relative z-0">
      <section
        className={`flex flex-col-reverse items-center lg:flex-row justify-center ${
          props.reverse && "lg:flex-row-reverse"
        } gap-12 lg:gap-24`}
      >
        <div className="flex justify-center lg:w-1/2">
          <Image
            src={props.img}
            alt={props.img_alt}
            title={props.img_title}
            height={500}
            width={500}
            loading="lazy"
            className="w-full max-w-sm lg:max-w-md h-auto mix-blend-multiply"
          />
        </div>
        <div className="flex lg:w-1/2 flex-col items-center text-center lg:text-left lg:items-start justify-center">
          <Heading text={props.title} />
          <p className="mt-6 text-lg text-gray/80 leading-relaxed font-light">
            {props.text}
          </p>
        </div>
      </section>
    </SpotlightCard>
  );
};

export default InfoBlock;
