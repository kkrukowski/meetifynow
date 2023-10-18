import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CopyLinkButton(props: {
  link: string;
  className?: string;
}) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.link);
  };

  return (
    <button
      type="button"
      className={`bg-light-primary hover:bg-light-primary-hover active:bg-light-primary-active text-dark font-medium w-fit px-4 py-2 rounded-lg mt-5 self-center transition-colors ${props.className}`}
      onClick={copyToClipboard}
    >
      <span className="flex items-center">
        Skopiuj link
        <div className="ml-2">
          <FontAwesomeIcon icon={faLink} />
        </div>
      </span>
    </button>
  );
}
