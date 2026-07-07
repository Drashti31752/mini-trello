import QueryProvider from "@/components/QueryProvider";
import "./globals.css";

export const metadata = {
  title: "Mini Trello",
  description: "Mini Trello App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
