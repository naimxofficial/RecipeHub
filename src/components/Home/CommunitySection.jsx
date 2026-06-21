import { Button } from "@heroui/react";
import { ChefHat, Users, Heart, Award } from "lucide-react";
import NextLink from "next/link";

export default function CommunitySection() {
    return (
        <section className="bg-surface py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl bg-background border border-separator p-8 md:p-16 text-center">
                    {/* Icon */}
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10">
                        <ChefHat className="h-12 w-12 text-accent" strokeWidth={1.8} />
                    </div>

                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-4">
                        Join the RecipeHub Community
                    </h2>

                    <p className="text-sm md:text-md text-muted max-w-2xl mx-auto mb-10">
                        Share your recipes, discover new flavors, and connect with thousands of home cooks who are passionate about good food.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        <div className="text-center">
                            <div className="text-3xl font-semibold text-accent mb-1">12K+</div>
                            <div className="text-sm text-muted">Recipes Shared</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-semibold text-accent mb-1">8.4K</div>
                            <div className="text-sm text-muted">Active Cooks</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-semibold text-accent mb-1">142</div>
                            <div className="text-sm text-muted">Countries</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-semibold text-accent mb-1">4.9</div>
                            <div className="text-sm text-muted">Average Rating</div>
                        </div>
                    </div>

                    {/* Newsletter Signup */}
                    <div className="max-w-md mx-auto mb-12">
                        <p className="text-muted mb-4 font-medium">
                            Get weekly recipe inspiration straight to your inbox
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 items-center">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="flex-1 rounded-xl border border-separator bg-background px-5 py-3 text-sm focus:outline-none focus:border-accent"
                            />
                            <Button size="sm" variant="primary" className="whitespace-nowrap">
                                Subscribe
                            </Button>
                        </div>
                        <p className="text-xs text-muted mt-3">
                            Join 6,800+ cooks. Unsubscribe anytime.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <NextLink
                            href="/recipes"
                            className="inline-flex items-center gap-2 rounded-full border border-separator px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            <Heart className="size-4" />
                            Browse Recipes
                        </NextLink>

                        <NextLink
                            href="/dashboard"
                            className="inline-flex items-center gap-2 rounded-full border border-separator px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            <Users className="size-4" />
                            Start Sharing
                        </NextLink>

                        <NextLink
                            href="/about"
                            className="inline-flex items-center gap-2 rounded-full border border-separator px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            <Award className="size-4" />
                            Learn More
                        </NextLink>
                    </div>
                </div>
            </div>
        </section>
    );
}