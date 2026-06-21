import { Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        id: 1,
        name: "Priya Sharma",
        location: "Mumbai, India",
        image: "https://picsum.photos/id/64/80/80",
        quote: "RecipeHub helped me discover authentic regional recipes from my grandmother's era. The community here is so supportive!",
        recipe: "Butter Chicken",
    },
    {
        id: 2,
        name: "Marco Rossi",
        location: "Rome, Italy",
        image: "https://picsum.photos/id/91/80/80",
        quote: "Finally a platform where real home cooks share their secrets. My tiramisu recipe got featured last month!",
        recipe: "Classic Tiramisu",
    },
    {
        id: 3,
        name: "Aisha Khan",
        location: "Lagos, Nigeria",
        image: "https://picsum.photos/id/1027/80/80",
        quote: "The variety of African and fusion recipes is incredible. I've learned so many new techniques from other members.",
        recipe: "Jollof Rice",
    },
];

export default function TestimonialsSection() {
    return (
        <section className="bg-background py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-3">
                        Real Stories
                    </span>
                    <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                        Loved by Home Cooks
                    </h2>
                    <p className="text-muted mt-3 max-w-md mx-auto">
                        Don&apos;t just take our word for it — hear from our growing community.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            className="group bg-surface border border-separator rounded-3xl p-8 hover:border-accent/30 transition-all duration-300 flex flex-col"
                        >
                            <Quote className="size-8 text-accent/40 mb-6" />

                            <p className="text-foreground/90 leading-relaxed mb-8 flex-1">
                                “{testimonial.quote}”
                            </p>

                            <div className="flex items-center gap-4">
                                <Image
                                    width={48}
                                    height={48}
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-background"
                                />
                                <div>
                                    <div className="font-semibold text-foreground">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-sm text-muted">
                                        {testimonial.location}
                                    </div>
                                    <div className="text-xs text-accent mt-1">
                                        Featured: {testimonial.recipe}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust bar */}
                <div className="mt-16 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-muted">
                    <div className="flex items-center gap-2">
                        <span className="text-accent">★</span> 4.9/5 Average Rating
                    </div>
                    <div>10,000+ Happy Cooks</div>
                    <div>Featured in Food & Wine</div>
                </div>
            </div>
        </section>
    );
}