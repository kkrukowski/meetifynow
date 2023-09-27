function Title(props: { text: string }) {
  const titleStyle = "text-4xl font-bold mb-10";

  return <h1 className={titleStyle}>{props.text}</h1>;
}

export default Title;
