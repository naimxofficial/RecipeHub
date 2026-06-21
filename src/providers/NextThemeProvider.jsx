'use client'

import { ThemeProvider } from "next-themes";

const NextThemeProvider = ({ children }) => {
    return (
        <ThemeProvider attribute = "class"
  defaultTheme = "light"
  enableSystem = { false }
  disableTransitionOnChange
  scriptProps = {{ "data-cfasync": "false" }}>
    { children }
        </ThemeProvider>
    );
};

export default NextThemeProvider;