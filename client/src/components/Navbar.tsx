import meetifyNowLogo from "../assets/imgs/meetifynow-logo.webp";

export default function Navbar() {
  return (
    <nav className="absolute left-0 top-0 w-full p-5 md:p-8 flex align-center">
      <a href="/">
        <img
          src={meetifyNowLogo}
          alt="Logo"
          title="MeetifyNow"
          className="h-8 w-auto"
        />
      </a>
    </nav>
  );
}
