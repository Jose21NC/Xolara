interface DetailHeroProps {
  image: string;
  tag: string;
  title: string;
  location: string;
}

export default function DetailHero({ image, tag, title, location }: DetailHeroProps) {
  return (
    <div className="relative h-[280px] w-full bg-neutral-100 overflow-hidden shadow-inner">
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/35" />
      <div className="absolute bottom-4 left-5 right-5 text-white flex flex-col gap-2">
        <span className="figma-tag text-[#4d6b54]">{tag}</span>
        <h1 className="figma-heading-xl text-[#fff8f6] text-left">{title}</h1>
        <p className="figma-body-lg text-[rgba(255,248,246,0.90)] flex items-center gap-1">
          {location}
        </p>
      </div>
    </div>
  );
}