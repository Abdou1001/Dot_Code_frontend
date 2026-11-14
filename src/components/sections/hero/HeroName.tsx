export function HeroName({ name }: { name: string }) {
    return <h1 data-hero-intro id="hero-title" className="mt-1 animate-[hero-name-gradient_9s_linear_infinite] bg-linear-to-r from-[#1d4ed8] via-[#60a5fa] to-[#1d4ed8] bg-[length:200%_auto] bg-[position:0%_center] bg-clip-text text-5xl font-bold leading-[1.14] tracking-[-0.045em] text-transparent motion-reduce:animate-none sm:text-6xl lg:text-7xl">{name}</h1>;
}
