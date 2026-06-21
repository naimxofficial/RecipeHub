export default function SectionHeading({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          <span className="size-1.5 rounded-full bg-accent" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-muted">{description}</p>
      )}
    </div>
  );
}