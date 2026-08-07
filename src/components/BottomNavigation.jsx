import { useEffect, useState } from "react";
import "./BottomNavigation.css";

const items = [
  {
    id: "home",
    label: "Home",
    selector: ".wedding-hero-section",
    icon: (
      <>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5.5 10v10h13V10" />
        <path d="M9.5 20v-6h5v6" />
      </>
    ),
  },
  {
    id: "couple",
    label: "Mempelai",
    selector: "#section-4",
    icon: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="16.5" cy="9" r="2.5" />
        <path d="M3.5 20c.4-4 2.4-6 5.5-6s5.1 2 5.5 6" />
        <path d="M14 15c3.5-.5 5.7 1.2 6.5 5" />
      </>
    ),
  },
  {
    id: "event",
    label: "Acara",
    selector: "#section-6",
    icon: (
      <>
        <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
        <path d="M7 3v5M17 3v5M3.5 10h17" />
        <path d="M8 14h2M14 14h2M8 17.5h2M14 17.5h2" />
      </>
    ),
  },
  {
    id: "gallery",
    label: "Galeri",
    selector: "#section-7",
    icon: (
      <>
        <rect x="3.5" y="4" width="17" height="16" rx="2" />
        <circle cx="8.5" cy="9" r="1.5" />
        <path d="m5.5 18 4.2-4.5 3 3 2.4-2.6 3.4 4.1" />
      </>
    ),
  },
  {
    id: "rsvp",
    label: "RSVP",
    selector: "#section-8",
    icon: (
      <>
        <path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8l-5 3v-3H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
        <path d="M8 9h8M8 13h5" />
      </>
    ),
  },
  {
    id: "gift",
    label: "Gift",
    selector: "#section-9",
    icon: (
      <>
        <rect x="3.5" y="9" width="17" height="11" rx="1.5" />
        <path d="M12 9v11M3 12.5h18" />
        <path d="M12 9c-3.8 0-6-1.1-6-3 0-1.5 1.2-2.5 2.6-2 1.8.6 2.8 3.2 3.4 5Z" />
        <path d="M12 9c3.8 0 6-1.1 6-3 0-1.5-1.2-2.5-2.6-2-1.8.6-2.8 3.2-3.4 5Z" />
      </>
    ),
  },
];

export default function BottomNavigation() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const container = document.querySelector(".invitation-scroll");
    if (!container) return;

    const targets = items
      .map((item) => ({
        ...item,
        element: document.querySelector(item.selector),
      }))
      .filter((item) => item.element);

    const updateActive = () => {
      const containerRect = container.getBoundingClientRect();
      const center = containerRect.top + containerRect.height / 2;

      let closest = null;
      let closestDistance = Infinity;

      targets.forEach((item) => {
        const rect = item.element.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - center);

        if (distance < closestDistance) {
          closestDistance = distance;
          closest = item;
        }
      });

      if (closest) {
        setActive(closest.id);
      }
    };

    updateActive();
    container.addEventListener("scroll", updateActive, { passive: true });

    return () => {
      container.removeEventListener("scroll", updateActive);
    };
  }, []);

  const navigate = (item) => {
    const target = document.querySelector(item.selector);

    if (!target) return;

    setActive(item.id);

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <nav className="bottomNav" aria-label="Navigasi undangan">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={
            active === item.id
              ? "bottomNav__button is-active"
              : "bottomNav__button"
          }
          onClick={() => navigate(item)}
          aria-label={item.label}
          title={item.label}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="bottomNav__icon"
          >
            {item.icon}
          </svg>
        </button>
      ))}
    </nav>
  );
}
