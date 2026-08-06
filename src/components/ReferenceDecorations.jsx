const DECORATIONS = {
  blessing: [
    {
      className: "reference-landscape",
      src: "/reference-assets/decoration-2.webp",
    },
  ],
  bride: [
    {
      className: "reference-tree reference-tree-sukun",
      src: "/reference-assets/decoration-suk.png",
    },
    {
      className: "reference-static-bird reference-bride-bird",
      src: "/reference-assets/bird-decoration-1.png",
    },
  ],
  groom: [
    {
      className: "reference-tree reference-tree-palm",
      src: "/reference-assets/decoration-pal.png",
    },
    {
      className: "reference-static-bird reference-groom-bird",
      src: "/reference-assets/bird-decoration-2.png",
    },
    {
      className: "reference-peacocks",
      src: "/reference-assets/decoration-mer.png",
    },
  ],
};

export default function ReferenceDecorations({ variant }) {
  const decorations = DECORATIONS[variant] || [];

  if (decorations.length === 0) {
    return null;
  }

  return (
    <div
      className={`reference-decorations reference-decorations--${variant}`}
      aria-hidden="true"
    >
      {decorations.map((decoration) => (
        <img
          key={decoration.src}
          className={decoration.className}
          src={decoration.src}
          alt=""
          draggable="false"
        />
      ))}
    </div>
  );
}
