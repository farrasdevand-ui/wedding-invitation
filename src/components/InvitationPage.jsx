import ReferenceDecorations from "./ReferenceDecorations";
import FlyingBirds from "./FlyingBirds";
import { useEffect, useRef, useState } from "react";
import { invitationConfig } from "../config/invitation";
import Section4 from "../sections/Section4";
import Section5 from "../sections/Section5";

function calculateTimeLeft() {
  const targetDate = new Date(invitationConfig.eventDate).getTime();
  const difference = Math.max(targetDate - Date.now(), 0);

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function CalendarIcon() {
  return (
    <svg
      className="calendar-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M7 3V7M17 3V7M3 10H21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 14H10M14 14H16M8 18H10M14 18H16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SaveDateButton() {
  const handleSaveDate = () => {
    const startDate = new Date(invitationConfig.eventDate);
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

    const formatDate = (date) =>
      date
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}Z$/, "Z");

    const calendarContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedding Invitation//ID",
      "BEGIN:VEVENT",
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:The Wedding of ${invitationConfig.coupleNames}`,
      "DESCRIPTION:Wedding Invitation",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([calendarContent], {
      type: "text/calendar;charset=utf-8",
    });

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = "wedding-date.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <button
      type="button"
      className="save-date-button reveal-up reveal-delay-6"
      onClick={handleSaveDate}
    >
      <CalendarIcon />
      <span>Simpan Tanggal</span>
    </button>
  );
}

export default function InvitationPage() {
  const scrollContainerRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return undefined;
    }

    const revealSections = Array.from(
      scrollContainer.querySelectorAll(".invitation-section"),
    );

    const sections = revealSections;

    scrollContainer.classList.add("reveal-ready");

    sections.forEach((section) => {
      const revealItems = Array.from(
        section.querySelectorAll(".reveal-up"),
      ).filter((element) => !element.closest('[aria-hidden="true"]'));

      revealItems.forEach((element, index) => {
        const delay = 80 + index * 110;

        element.style.setProperty("--reveal-delay", `${delay}ms`);

        if (!section.dataset.revealComplete) {
          element.classList.remove("is-visible");
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const section = entry.target;

          if (section.dataset.revealComplete === "true") {
            observer.unobserve(section);
            return;
          }

          const revealItems = Array.from(
            section.querySelectorAll(".reveal-up"),
          ).filter((element) => !element.closest('[aria-hidden="true"]'));

          window.requestAnimationFrame(() => {
            section.classList.add("section-is-visible");

            revealItems.forEach((element) => {
              element.classList.add("is-visible");
            });

            section.dataset.revealComplete = "true";
          });

          observer.unobserve(section);
        });
      },
      {
        root: scrollContainer,
        threshold: 0.28,
        rootMargin: "-6% 0px -12% 0px",
      },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
      scrollContainer.classList.remove("reveal-ready");
    };
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return undefined;
    }

    let isScrollLocked = false;

    const handleWheel = (event) => {
      const sections = Array.from(
        scrollContainer.querySelectorAll(".invitation-section"),
      );

      if (sections.length < 2 || isScrollLocked || Math.abs(event.deltaY) < 8) {
        return;
      }

      event.preventDefault();

      const currentIndex = Math.round(
        scrollContainer.scrollTop / scrollContainer.clientHeight,
      );

      const direction = event.deltaY > 0 ? 1 : -1;

      const nextIndex = Math.min(
        Math.max(currentIndex + direction, 0),
        sections.length - 1,
      );

      if (nextIndex === currentIndex) {
        return;
      }

      isScrollLocked = true;

      sections[nextIndex].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      window.setTimeout(() => {
        isScrollLocked = false;
      }, 850);
    };

    scrollContainer.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const countdownItems = [
    {
      value: timeLeft.days,
      label: "Hari",
    },
    {
      value: timeLeft.hours,
      label: "Jam",
    },
    {
      value: timeLeft.minutes,
      label: "Menit",
    },
    {
      value: timeLeft.seconds,
      label: "Detik",
    },
  ];

  return (
    <main
      ref={scrollContainerRef}
      className="invitation-scroll invitation-enter"
    >
      <section className="invitation-section wedding-hero-section">
        <div className="wedding-hero-background" aria-hidden="true" />

        <div className="wedding-hero-ambient" aria-hidden="true">
          <FlyingBirds />
        </div>

        <div className="wedding-hero-decorations" aria-hidden="true">
          <img
            className="wedding-bottom-piece wedding-bottom-left-tree"
            src="/reference-assets/decoration-suk.png"
            alt=""
            draggable="false"
          />

          <img
            className="wedding-bottom-piece wedding-bottom-right-tree"
            src="/reference-assets/decoration-pal.png"
            alt=""
            draggable="false"
          />

          <img
            className="wedding-bottom-piece wedding-bottom-center-peacocks"
            src="/reference-assets/decoration-mer.png"
            alt=""
            draggable="false"
          />

          <img
            className="wedding-bottom-piece wedding-bottom-left-bird"
            src="/reference-assets/bird-decoration-1.png"
            alt=""
            draggable="false"
          />

          <img
            className="wedding-bottom-piece wedding-bottom-right-bird"
            src="/reference-assets/bird-decoration-2.png"
            alt=""
            draggable="false"
          />
        </div>

        <div className="wedding-hero-content">
          <img
            className="wedding-rumah-gadang"
            src="/reference-assets/rumah-gadang.svg"
            alt=""
            aria-hidden="true"
            draggable="false"
          />

          <div className="portrait-frame reveal-up reveal-delay-1">
            <div
              className="portrait-photo"
              role="img"
              aria-label={`Foto ${invitationConfig.coupleNames}`}
            />

            <div className="portrait-frame-decoration" aria-hidden="true" />
          </div>

          <p className="wedding-hero-label reveal-up reveal-delay-2">
            {invitationConfig.weddingLabel}
          </p>

          <h1 className="wedding-hero-title reveal-up reveal-delay-3">
            {invitationConfig.coupleNames}
          </h1>

          <p className="wedding-hashtag reveal-up reveal-delay-4">
            {invitationConfig.hashtag}
          </p>

          <div className="countdown-grid">
            {countdownItems.map((item) => (
              <div className="countdown-card reveal-up" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <p className="wedding-date reveal-up reveal-delay-6">
            {invitationConfig.displayDate}
          </p>

          <SaveDateButton />
        </div>
      </section>
      <ReferenceDecorations variant="blessing" />{" "}
      <section className="invitation-section blessing-section">
        <div className="blessing-background" aria-hidden="true" />

        <div className="blessing-overlay" aria-hidden="true" />

        <div className="blessing-content">
          <div className="blessing-monogram reveal-up reveal-delay-1">
            {invitationConfig.coupleNames
              .split("&")
              .map((name) => name.trim().charAt(0).toUpperCase())
              .join(" & ")}
          </div>

          <div className="blessing-bird-wrapper reveal-up reveal-delay-2">
            <img
              className="blessing-bird"
              src="/images/section-3-bird.png"
              alt=""
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>

          <p
            className="blessing-bismillah reveal-up reveal-delay-3"
            lang="ar"
            dir="rtl"
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>

          <p
            className="blessing-arabic reveal-up reveal-delay-4"
            lang="ar"
            dir="rtl"
          >
            وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
            لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ
            إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
          </p>

          <p className="blessing-translation reveal-up reveal-delay-5">
            Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan
            untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa
            tenteram kepadanya. Dan dijadikan-Nya di antaramu rasa kasih dan
            sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat
            tanda-tanda bagi kaum yang berpikir.
          </p>

          <p className="blessing-reference reveal-up reveal-delay-6">
            QS. Ar-Rum 21
          </p>

          <div className="section-three-gallery-space" aria-hidden="true" />
        </div>
      </section>
      <Section4 />
      <Section5 />
    </main>
  );
}
