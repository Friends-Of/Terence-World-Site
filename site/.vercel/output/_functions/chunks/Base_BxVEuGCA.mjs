import { e as createComponent, f as createAstro, h as addAttribute, l as renderHead, n as renderSlot, r as renderTemplate } from './astro/server_B4R6OevK.mjs';
import 'piccolore';
import 'clsx';

const $$Astro = createAstro();
const $$Base = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Base;
  const {
    title = "Terence Brasch",
    description = "A minimal, near-future personal site.",
    minimal = false
  } = Astro2.props;
  const pageTitle = title === "Terence Brasch" ? title : `${title} - Terence Brasch`;
  const navItems = [
    { href: "/about", label: "About" },
    { href: "/projects/fireside", label: "Fireside" },
    { href: "/projects/goodies", label: "Goodies" },
    { href: "/fit", label: "Fit" },
    { href: "/system", label: "System" }
  ];
  const currentPath = Astro2.url.pathname.replace(/\/$/, "") || "/";
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description"${addAttribute(description, "content")}><meta name="color-scheme" content="light"><title>${pageTitle}</title>${!minimal && renderTemplate`<style is:global>
        :root {
          --bg: #f6f6f1;
          --bg-2: #e9eef2;
          --ink: #0f1419;
          --slate: #2e3741;
          --muted: #5c6a78;
          --edge: #d5dbe1;
          --accent: #2b5d66;
          --accent-2: #7aa6a8;
          --glow: #f2f7f2;
          --font-body: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif;
          --font-heading: "Avenir Next", "Gill Sans", "Trebuchet MS", "Helvetica Neue", sans-serif;
          --font-mono: "IBM Plex Mono", "SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: var(--font-body);
          color: var(--ink);
          background: linear-gradient(120deg, var(--bg) 0%, var(--bg-2) 55%, var(--glow) 100%);
          min-height: 100vh;
        }

        body::before {
          content: "";
          position: fixed;
          inset: 0;
          background-image: linear-gradient(transparent 96%, rgba(20, 30, 40, 0.06) 100%),
            linear-gradient(90deg, transparent 96%, rgba(20, 30, 40, 0.06) 100%);
          background-size: 48px 48px;
          opacity: 0.4;
          pointer-events: none;
          z-index: -1;
        }

        a {
          color: inherit;
          text-decoration: none;
          border-bottom: 1px solid rgba(46, 55, 65, 0.25);
          transition: border-color 0.2s ease, color 0.2s ease;
        }

        a:hover,
        a:focus-visible {
          color: var(--accent);
          border-color: var(--accent);
        }

        header {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 16px;
          padding: 32px 24px 0;
          max-width: 980px;
          margin: 0 auto;
        }

        .site-title {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-bottom: none;
        }

        nav {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          font-family: var(--font-heading);
          font-size: 0.95rem;
        }

        nav a {
          border-bottom: none;
          opacity: 0.72;
        }

        nav a[aria-current="page"] {
          opacity: 1;
          color: var(--accent);
        }

        main {
          max-width: 980px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        h1,
        h2,
        h3 {
          font-family: var(--font-heading);
          font-weight: 600;
          letter-spacing: 0.01em;
          margin: 0 0 16px;
        }

        h1 {
          font-size: clamp(2.2rem, 4vw, 3.1rem);
        }

        h2 {
          font-size: clamp(1.4rem, 2.5vw, 1.9rem);
        }

        p {
          margin: 0 0 16px;
          color: var(--slate);
          line-height: 1.65;
          font-size: 1.05rem;
        }

        .muted {
          color: var(--muted);
        }

        .meta {
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.75rem;
          color: var(--muted);
          margin-bottom: 16px;
        }

        .hero {
          display: grid;
          gap: 24px;
        }

        .panel {
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid var(--edge);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 24px 60px rgba(20, 30, 40, 0.08);
          backdrop-filter: blur(6px);
        }

        .grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }

        .card {
          border: 1px solid var(--edge);
          border-radius: 16px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.65);
        }

        .card h3 {
          margin-bottom: 8px;
        }

        ul {
          padding-left: 18px;
          margin: 0 0 16px;
          color: var(--slate);
          line-height: 1.6;
        }

        footer {
          max-width: 980px;
          margin: 0 auto;
          padding: 0 24px 48px;
          color: var(--muted);
          font-size: 0.9rem;
        }

        @media (prefers-reduced-motion: no-preference) {
          .panel,
          .card {
            animation: rise 0.7s ease both;
            animation-delay: var(--delay, 0ms);
          }

          .grid .card:nth-child(1) {
            --delay: 90ms;
          }

          .grid .card:nth-child(2) {
            --delay: 160ms;
          }

          .grid .card:nth-child(3) {
            --delay: 230ms;
          }
        }

        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 720px) {
          header {
            padding-top: 24px;
          }

          nav {
            gap: 12px;
          }

          .panel {
            padding: 22px;
          }
        }
      </style>`}${renderHead()}</head> <body> ${!minimal && renderTemplate`<header> <a class="site-title" href="/">Terence Brasch</a> <nav> ${navItems.map((item) => {
    const isActive = item.href === currentPath;
    return renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute(isActive ? "page" : void 0, "aria-current")}> ${item.label} </a>`;
  })} </nav> </header>`} <main> ${renderSlot($$result, $$slots["default"])} </main> ${!minimal && renderTemplate`<footer> <span class="muted">Minimal, near-future notes. Built for clarity.</span> </footer>`} </body></html>`;
}, "C:/dev/Terence-World-Site/site/src/layouts/Base.astro", void 0);

export { $$Base as $ };
