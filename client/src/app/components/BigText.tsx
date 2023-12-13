function BigText(props: { text: string }) {
  const titleStyle =
    "text-7xl md:text-9xl text-center text-dark font-bold w-full";

  return <h1 className={titleStyle}>{props.text}</h1>;
}

export default BigText;
