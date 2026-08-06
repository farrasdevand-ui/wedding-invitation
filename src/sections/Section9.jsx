import { useState } from "react";
import "./Section9.css";
import section9Background from "../assets/section9/BG_4.webp";

export default function Section9() {
  const [openPanel, setOpenPanel] = useState(null);
  const [copiedKey, setCopiedKey] = useState("");

  const togglePanel = (panelName) => {
    setOpenPanel((current) => (current === panelName ? null : panelName));
    setCopiedKey("");
  };

  const copyText = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);

      window.setTimeout(() => {
        setCopiedKey((current) => (current === key ? "" : current));
      }, 1800);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section
      id="section-9"
      className="invitation-section section9"
      style={{
        backgroundImage: `url(${section9Background})`,
      }}
    >
      <div className="section9__overlay" />

      <div className="section9__content">
        <div className="section9__main reveal-up">
          <p className="section9__eyebrow">HADIAH & KADO</p>

          <h2 className="section9__title">
            Kehadiran dan doa restu dari Bapak/Ibu/Sdr merupakan kebahagiaan
            yang tak ternilai bagi kami.
          </h2>

          <p className="section9__subtitle">
            Namun apabila memberi merupakan cara untuk berbagi bahagia, kami
            menerimanya dengan penuh syukur dan terima kasih.
          </p>

          <div className="section9__ornament" aria-hidden="true">
            <span />
            <b>◇</b>
            <span />
          </div>

          <div className="section9__actions">
            <button
              type="button"
              className={
                openPanel === "gift"
                  ? "section9__actionButton is-active"
                  : "section9__actionButton"
              }
              onClick={() => togglePanel("gift")}
            >
              <span className="section9__actionIcon" aria-hidden="true">
                ✦
              </span>
              <span>Kirim Kado</span>
            </button>

            {openPanel === "gift" && (
              <div className="section9__card">
                <p className="section9__cardLabel">Nama Penerima</p>
                <p className="section9__cardValue">annisa</p>

                <p className="section9__cardLabel">Alamat Pengiriman</p>
                <p className="section9__cardValue">padang panjang</p>

                <p className="section9__cardLabel">Nomor HP</p>
                <p className="section9__cardValue">089610173729</p>

                <button
                  type="button"
                  className="section9__copyButton"
                  onClick={() => copyText("089610173729", "gift-phone")}
                >
                  {copiedKey === "gift-phone"
                    ? "Nomor berhasil disalin"
                    : "Salin Nomor HP"}
                </button>
              </div>
            )}

            <button
              type="button"
              className={
                openPanel === "money"
                  ? "section9__actionButton is-active"
                  : "section9__actionButton"
              }
              onClick={() => togglePanel("money")}
            >
              <span className="section9__actionIcon" aria-hidden="true">
                ♡
              </span>
              <span>Amplop Online</span>
            </button>

            {openPanel === "money" && (
              <div className="section9__card">
                <p className="section9__cardLabel">Bank / E-Wallet</p>
                <p className="section9__cardValue">Sea Bank</p>

                <p className="section9__cardLabel">Nomor Rekening</p>
                <p className="section9__cardValue">901637356405</p>

                <p className="section9__cardLabel">Atas Nama</p>
                <p className="section9__cardValue">Rihadatul Aisya Putri</p>

                <button
                  type="button"
                  className="section9__copyButton"
                  onClick={() => copyText("901637356405", "money-account")}
                >
                  {copiedKey === "money-account"
                    ? "Nomor rekening berhasil disalin"
                    : "Salin Nomor Rekening"}
                </button>
              </div>
            )}
          </div>

          <p className="section9__thanks">
            Terima kasih atas kebaikan hati Anda
          </p>
        </div>

        <footer className="section9__footer reveal-up">
          <p className="section9__footerText">
            Buat undanganmu bersama Duajiwa
          </p>

          <div className="section9__footerLogo">
            <span className="section9__footerLogoTop">dua</span>
            <span className="section9__footerLogoBottom">jiwa</span>
          </div>

          <div className="section9__footerLinks">
            <a href="https://duajiwa.com" target="_blank" rel="noreferrer">
              <span>◎</span>
              <span>duajiwa.com</span>
            </a>

            <span className="section9__footerDivider">|</span>

            <a
              href="https://wa.me/6282220700245"
              target="_blank"
              rel="noreferrer"
            >
              <span>◌</span>
              <span>0822 2070 0245</span>
            </a>

            <span className="section9__footerDivider">|</span>

            <a
              href="https://instagram.com/duajiwa.invitation"
              target="_blank"
              rel="noreferrer"
            >
              <span>▣</span>
              <span>duajiwa.invitation</span>
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}
