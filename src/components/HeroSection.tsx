interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  className?: string;
}

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
  className = '',
}: HeroSectionProps) {
  return (
    <div
      className={`relative w-full h-[530px] flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50 z-10" />
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="relative z-20 flex flex-col items-center gap-4 px-6 text-center">
        <h1 className="figma-heading-xl text-[#412c21] text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="figma-body-lg text-[#4f4540] max-w-xs">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}