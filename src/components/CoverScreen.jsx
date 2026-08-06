import { invitationConfig } from "../config/invitation";

function EnvelopeIcon() {
  return (
    <svg
      className="envelope-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="4.5"
        width="19"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M4 7L12 13L20 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CoverScreen({ onOpen }) {
  const searchParams = new URLSearchParams(window.location.search);
  const guestFromUrl = searchParams.get("to")?.trim();

  const guestName = guestFromUrl || invitationConfig.defaultGuestName;

  return (
    <section className="cover-screen">
      <div className="cover-overlay" />

      <div className="cover-content">
        <p className="cover-label">{invitationConfig.weddingLabel}</p>

        <h1 className="cover-title">{invitationConfig.coupleNames}</h1>

        <p className="recipient-label">{invitationConfig.recipientLabel}</p>

        <div className="guest-box">
          <p>{guestName}</p>
        </div>

        <button type="button" className="open-button" onClick={onOpen}>
          <EnvelopeIcon />

          <span>{invitationConfig.openButtonText}</span>
        </button>
      </div>
    </section>
  );
}
