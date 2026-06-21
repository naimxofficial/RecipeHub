'use client';

import NextLink from 'next/link';
import { ChefHat, Home, ArrowLeft } from 'lucide-react';
import { Button } from "@heroui/react";

export default function NotFound() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center px-4 ">
            <div className="max-w-2xl w-full text-center">
                {/* Large 404 */}
                <div className="mb-8">
                    <span className="text-[120px] md:text-[160px] font-display font-bold tracking-tighter text-foreground/10">
                        404
                    </span>
                </div>

                {/* Icon */}
                <div className="mx-auto mb-6 flex justify-center">
                    <div className="p-4 rounded-2xl bg-surface border border-separator">
                        <ChefHat className="size-16 md:size-20 text-accent" strokeWidth={1.75} />
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 tracking-tight">
                    Oops! Recipe Not Found
                </h1>

                <p className="text-lg md:text-xl text-muted max-w-md mx-auto mb-10">
                    Looks like this recipe page got eaten or never existed.
                    Let&apos;s get you back to the kitchen!
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        asChild
                        size="lg"
                        variant="primary"
                        className="w-full sm:w-auto px-8"
                    >
                        <NextLink href="/" className="flex items-center">
                            <Home className="size-5 mr-2" />
                            Back to Home
                        </NextLink>
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto px-8"
                    >
                        <ArrowLeft className="size-5 mr-2" />
                        Go Back
                    </Button>
                </div>

                {/* Helpful Links */}
                <div className="mt-12 pt-8 border-t border-separator mb-10">
                    <p className="text-muted mb-4 text-sm">Try exploring these instead:</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <NextLink
                            href="/recipes"
                            className="text-sm px-5 py-2 bg-surface hover:bg-accent hover:text-accent-foreground transition-colors rounded-full border border-separator"
                        >
                            Browse Recipes
                        </NextLink>
                        <NextLink
                            href="/dashboard"
                            className="text-sm px-5 py-2 bg-surface hover:bg-accent hover:text-accent-foreground transition-colors rounded-full border border-separator"
                        >
                            My Dashboard
                        </NextLink>
                    </div>
                </div>
            </div>
        </div>
    );
}