"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from 'lucide-react';
import { Switch } from "@heroui/react";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => window.localStorage.getItem("theme");
const getServerSnapshot = () => "dark";

export function ThemeSwitch() {
    const { theme, setTheme } = useTheme();
    const activeTheme = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
    const isDark = activeTheme !== "dark";

    const icons = {
        darkMode: {
            off: Moon,
            on: Sun,
            selectedControlClass: "",
        },
    };

    return (
        <div className="">
            {Object.entries(icons).map(([key, value]) => (
                <Switch 
                    key={key} 
                    isSelected={isDark} 
                    onChange={() => setTheme(theme === "dark" ? "light" : "dark")} 
                    size="lg"
                >
                    {({ isSelected }) => (
                        <>
                            <Switch.Control className={isSelected ? value.selectedControlClass : ""}>
                                <Switch.Thumb>
                                    <Switch.Icon>
                                        {isSelected ? (
                                            <value.on className="size-3 text-inherit opacity-100" />
                                        ) : (
                                            <value.off className="size-3 text-inherit opacity-70" />
                                        )}
                                    </Switch.Icon>
                                </Switch.Thumb>
                            </Switch.Control>
                        </>
                    )}
                </Switch>
            ))}
        </div>
    );
}