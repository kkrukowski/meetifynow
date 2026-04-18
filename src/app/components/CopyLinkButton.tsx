import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CopyLinkButton(props: {
  link: string;
  className?: string;
  dict: any;
}) {
  const copyToClipboard = () => {
    const currentUrl = window.location.href;
    const urlObject = new URL(currentUrl);
    const domainName = urlObject.hostname;

    const segment = "/meet/";

    const segmentIndex = currentUrl.indexOf(segment);

    let urlWithoutSegment;
    if (segmentIndex !== -1) {
      urlWithoutSegment = currentUrl.slice(segmentIndex + segment.length);
    } else {
      urlWithoutSegment = currentUrl;
    }

    const link = `https://${domainName}/meet/${urlWithoutSegment}`;

    navigator.clipboard.writeText(link);
  };

  return (
    <button
      type="button"
      className={`group relative display bg-light-primary hover:bg-light-primary-hover active:bg-light-primary-active text-dark font-medium w-fit px-4 py-2 rounded-lg mt-5 self-center transition-colors ${props.className}`}
      onClick={copyToClipboard}
    >
      <p className="absolute opacity-0 group-focus:animate-copy-button-success w-full left-0">
        {props.dict.button.copyLink.copied}
      </p>
      <span className="flex items-center group-focus:animate-copy-button">
        {props.dict.button.copyLink.copy}
        <div className="ml-2 transition-all group-hover:rotate-45">
          <FontAwesomeIcon icon={faLink} />
        </div>
      </span>
    </button>
  );
}
