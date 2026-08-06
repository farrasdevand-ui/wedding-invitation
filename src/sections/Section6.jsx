import "./Section6.css";
import bgSection6 from "../assets/section6/bg6.webp";

const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Jl.+Rahmah+Elyunusiah+No.40,+Pasar+Usang,+Kecamatan+Padang+Panjang+Barat,+Kota+Padang+Panjang,+Sumatera+Barat";

function MapPinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="section6__mapIcon"
    >
      <path
        d="M12 21s6-5.55 6-11a6 6 0 1 0-12 0c0 5.45 6 11 6 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function Section6() {
  return (
    <section
      id="section-6"
      className="invitation-section section6"
      style={{ backgroundImage: `url(${bgSection6})` }}
    >
      <div className="section6__panel">
        <div className="section6__content">
          <img
            loading="lazy"
            decoding="async"
            src="/reference-assets/rumah-gadang.svg"
            alt="Rumah Gadang"
            className="section6__logo reveal-up"
          />

          <div className="section6__event reveal-up">
            <h3 className="section6__eventTitle">Akad Nikah</h3>

            <p className="section6__date">Sabtu, 15 Agustus 2023</p>

            <p className="section6__time">Pukul 08.00 WIB</p>
          </div>

          <div className="section6__ornament" aria-hidden="true">
            <span className="section6__ornamentLine" />
            <span className="section6__ornamentHeart">♥</span>
            <span className="section6__ornamentLine" />
          </div>

          <div className="section6__event reveal-up">
            <h3 className="section6__eventTitle">Resepsi</h3>

            <p className="section6__date">Sabtu, 15 Agustus 2023</p>

            <p className="section6__time">Pukul 11.00 WIB s/d selesai</p>
          </div>

          <div className="section6__venue reveal-up">
            <p className="section6__venueLabel">Bertempat di:</p>

            <p className="section6__address">
              Jl. Rahmah Elyunusiah No.40,
              <br />
              Pasar Usang, Kecamatan Padang Panjang Barat,
              <br />
              Kota Padang Panjang, Sumatera Barat
            </p>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="section6__mapsButton"
            >
              <MapPinIcon />
              <span>Buka Maps</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
