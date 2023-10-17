export default function CopyLinkButton(props: { link: string }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.link);
  };

  return (
    <button
      className="bg-light-primary hover:bg-light-primary-hover active:bg-light-primary-active text-dark font-medium w-fit px-4 py-2 rounded-lg mt-5 self-center transition-colors"
      onClick={copyToClipboard}
    >
      <span>Skopiuj link 🔗</span>
    </button>
  );
}
