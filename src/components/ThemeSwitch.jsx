'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Switch } from "@heroui/react";
import { useEffect, useState } from "react";

export function ThemeSwitch() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-11 h-6 rounded-full bg-gray-200 dark:bg-zinc-700" />
        );
    }

    const isDark = resolvedTheme === "dark";

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark");
    };

    return (
        <Switch
            isSelected={isDark}
            onChange={toggleTheme}
            size="lg"
            aria-label="Toggle theme"
        >
            {/* Added Switch.Content wrapper required by HeroUI v3 */}
            <Switch.Content>
                <Switch.Control>
                    <Switch.Thumb>
                        <Switch.Icon>
                            {/* Replaced 'isSelected' with your existing 'isDark' state */}
                            {isDark ? (
                                <Sun className="size-3.5 text-inherit" />
                            ) : (
                                <Moon className="size-3.5 text-inherit" />
                            )}
                        </Switch.Icon>
                    </Switch.Thumb>
                </Switch.Control>
            </Switch.Content>
        </Switch>
    );
}