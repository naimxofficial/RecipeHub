'use client';

import { ThemeProvider } from "next-themes";

const NextThemeProvider = ({ children }) => {
    return (
        <ThemeProvider
            attribute="data-theme"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    );
};

export default NextThemeProvider;