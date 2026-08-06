import ReferenceDecorations from "../components/ReferenceDecorations";
import "./Section4.css";
import bridePhoto from "../assets/section4/foto_4.webp";

export default function Section4() {
  return (
    <section
      id="section-4"
      className="invitation-section section4"
      style={{ backgroundImage: "url('/assets/BG_4.webp')" }}
    >
      <ReferenceDecorations variant="bride" />
      <div className="section4__content">
        <h3 className="section4__title reveal-up">BISMILLAHIRRAHMANIRRAHIM</h3>

        <p className="section4__subtitle reveal-up">
          Maha suci Allah yang telah menciptakan
          <br />
          makhluk-Nya berpasang-pasangan.
          <br />
          Ya Allah rahmatilah pernikahan kami
        </p>

        <div className="section4__photoFrame reveal-up">
          <img
            loading="lazy"
            decoding="async"
            src={bridePhoto}
            alt="Annisa Rahma Zikra"
            className="section4__photo"
          />
        </div>

        <h2 className="section4__name reveal-up">
          Annisa Rahma
          <br />
          Zikra, ST
        </h2>

        <p className="section4__role reveal-up">Putri dari</p>

        <p className="section4__parents reveal-up">
          Bapak Asrul
          <br />
          &amp; Ibu Nurmi, S.Pd
        </p>

        <a
          className="section4__instagram"
          href="https://www.instagram.com/annisarz01"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram Annisa Rahma Zikra"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="section4__instagramIcon"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <circle
              cx="12"
              cy="12"
              r="4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <circle cx="17.4" cy="6.8" r="1.1" fill="currentColor" />
          </svg>

          <span>@annisarz01</span>
        </a>
      </div>
    </section>
  );
}
