import { SavedItemsProvider } from "@/context/SavedItems";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Nav from "@/components/Nav";

export const metadata = {
  title: "Blog App",
  description: "Youtube Blog App project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SavedItemsProvider>
              <Nav />
        {children}
        </SavedItemsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
