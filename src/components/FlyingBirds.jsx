import { useEffect, useRef } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function FlyingBirds() {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    const section = container.closest(".wedding-hero-section") || container;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduceMotion.matches) {
      playerRef.current?.pause();
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;

        const player = playerRef.current;

        if (!player) {
          return;
        }

        if (entry.isIntersecting) {
          player.play();
        } else {
          player.pause();
        }
      },
      {
        root: container.closest(".invitation-scroll"),
        threshold: 0.15,
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      playerRef.current?.pause();
    };
  }, []);

  return (
    <div ref={containerRef} className="wedding-birds-player">
      <DotLottieReact
        className="wedding-birds-canvas"
        src="/reference-assets/flying-birds.lottie"
        loop
        autoplay={false}
        speed={0.78}
        renderConfig={{
          autoResize: true,
          devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        }}
        dotLottieRefCallback={(player) => {
          playerRef.current = player;

          if (player && isVisibleRef.current) {
            player.play();
          }
        }}
      />
    </div>
  );
}
