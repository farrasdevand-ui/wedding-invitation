import ReferenceDecorations from "../components/ReferenceDecorations";
import "./Section5.css";
import section5Background from "../assets/section5/BG_4.png";
import groomPhoto from "../assets/section5/foto_5.jpg";
import peacockLeft from "../assets/section5/burungmerak.png";
import peacockRight from "../assets/section5/burung_merak_kiri.png";

export default function Section5() {
  return (
    <section
      id="section-5"
      className="invitation-section section5"
      style={{
        backgroundImage: `url(${section5Background})`,
      }}
    >
      <ReferenceDecorations variant="groom" />

      <div className="section5__peacocks" aria-hidden="true">
        <img
          src={peacockLeft}
          alt=""
          className="section5__peacock section5__peacock--left"
        />

        <img
          src={peacockRight}
          alt=""
          className="section5__peacock section5__peacock--right"
        />
      </div>

      <div className="section5__content">
        <div className="section5__photoFrame reveal-up">
          <img src={groomPhoto} alt="Kurniawan" className="section5__photo" />
        </div>

        <h2 className="section5__name reveal-up">Kurniawan, ST</h2>

        <p className="section5__role reveal-up">Putra dari</p>

        <p className="section5__parents reveal-up">
          Bapak H. Nachrowi, B.A
          <br />
          &amp; Ibu Hj. Asmi
        </p>
      </div>
    </section>
  );
}
