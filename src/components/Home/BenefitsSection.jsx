import { Clock, Users, Award, Heart } from "lucide-react";

const benefits = [
    {
        icon: Clock,
        title: "Save Time",
        description: "Tested & perfected recipes with clear steps so you spend less time guessing and more time enjoying.",
    },
    {
        icon: Users,
        title: "Real Community",
        description: "Learn directly from thousands of passionate home cooks sharing family recipes and secret tips.",
    },
    {
        icon: Award,
        title: "Trusted Recipes",
        description: "Every recipe is reviewed and rated by the community. Only the best make it to the top.",
    },
    {
        icon: Heart,
        title: "Made with Love",
        description: "From cozy comfort food to impressive dinner party dishes — all crafted for real kitchens.",
    },
];

export default function BenefitsSection() {
    return (
        <section className="bg-surface py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-3">
                        WHY RECIPEHUB
                    </span>
                    <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                        Cooking made better
                    </h2>
                    <p className="text-muted mt-3 max-w-lg mx-auto">
                        We built RecipeHub for people who love real food made at home.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="group bg-background border border-separator rounded-3xl p-8 hover:border-accent/30 hover:shadow-md transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                                <benefit.icon className="size-6 text-accent" strokeWidth={2} />
                            </div>

                            <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                                {benefit.title}
                            </h3>

                            <p className="text-muted leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}