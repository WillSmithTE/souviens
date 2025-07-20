import type { LinksFunction } from "@remix-run/cloudflare";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col">
        {header}
        <div className="flex-1">{children}</div>
        {footer}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

const header = (
  <header className="container mx-auto px-4 py-4 border-b border-gray-700/50">
    <h1 className="text-xl font-semibold text-orange-400">
      <Link to="/">Souviens</Link>
    </h1>
  </header>
);

const footer = (
  <footer className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-1 text-sm text-gray-300 border-t border-gray-700">
    <div className="container mx-auto text-center">
      <p>
        Made by{" "}
        <Link
          to="https://willsmithte.com"
          className="text-orange-400 hover:text-orange-300 underline transition-colors font-medium"
        >
          Will Smith
        </Link>
      </p>
    </div>
  </footer>
);
