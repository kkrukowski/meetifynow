import Heading from "../Heading";

const InfoBlock = (props: {
  img: string;
  img_alt: string;
  img_title: string;
  title: string;
  text: string;
  reverse: boolean;
}) => {
  return (
    <section
      className={`flex flex-col-reverse items-center sm:flex-row justify-center mb-24 ${
        props.reverse && "sm:flex-row-reverse"
      }`}
    >
      <div className="flex justify-center sm:w-1/2">
        <img
          src={props.img}
          alt={props.img_alt}
          title={props.img_title}
          className="m-0 sm:ml-10 mt-10 sm:mb-0 h-48 md:h-64 lg:h-auto"
        />
      </div>
      <div
        className={`flex sm:w-1/2 flex-col items-centers justify-center ${
          props.reverse ? "sm:mr-20" : "sm:ml-20"
        }`}
      >
        <Heading text={props.title} />
        <p className="mb-5 text-lg text-dark text-justify">{props.text}</p>
      </div>
    </section>
  );
};

export default InfoBlock;
