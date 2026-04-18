export default function Subheading(props: { text: string; className?: string }) {
    const headingStyle =
        "text-lg lg:text-xl text-dark font-medium mb-5";

    return <h3 className={headingStyle + " " + props.className}>{props.text}</h3>;
}
