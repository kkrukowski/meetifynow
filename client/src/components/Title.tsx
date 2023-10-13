function Title(props: { text: string }) {
  const titleStyle = "text-3xl md:text-4xl text-dark font-bold mb-10 w-full";

  return <h1 className={titleStyle}>{props.text}</h1>;
}

export default Title;
