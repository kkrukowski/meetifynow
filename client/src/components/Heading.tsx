function Heading(props: { text: string; className?: string }) {
  const headingStyle = "text-xl lg:text-2xl text-dark font-medium mb-5";

  return <h3 className={headingStyle + " " + props.className}>{props.text}</h3>;
}

export default Heading;
