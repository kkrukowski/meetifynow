import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CopyLinkButton(props: {
  link?: string;
  url?: string;
  className?: string;
  dict: any;
}) {
  const copyToClipboard = () => {
    let urlToCopy: string;

    if (props.url) {
      urlToCopy = props.url;
    } else {
      const currentUrl = window.location.href;
      const urlObject = new URL(currentUrl);
      const domainName = urlObject.hostname;
      const segment = "/meet/";
      const segmentIndex = currentUrl.indexOf(segment);
      const urlWithoutSegment =
        segmentIndex !== -1
          ? currentUrl.slice(segmentIndex + segment.length)
          : currentUrl;
      urlToCopy = `https://${domainName}/meet/${urlWithoutSegment}`;
    }

    navigator.clipboard.writeText(urlToCopy);
  };

  return (
    <button
      type="button"
      className={`group relative display bg-white hover:bg-gray/5 active:bg-gray/10 text-dark font-medium w-fit px-5 py-2.5 rounded-[16px] self-center border border-gray/10 shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${props.className ?? ""}`}
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
