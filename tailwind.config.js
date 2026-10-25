/** tailwind.config.js
 * Design tokens for the Movie & Media Discovery Catalog.
 *
 * Palette rationale: a deep indigo-black base (not pure #000) reads as
 * "cinema at night" without defaulting to the generic near-black + red-alert
 * look most streaming clones use. Amber stands in for marquee-light /
 * spotlight glow — used sparingly for ratings, active states, and the one
 * primary CTA per view.
 */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07070C", // page background
          900: "#0D0E17", // raised surfaces (navbar, footer)
          800: "#151726", // cards
          700: "#1E2133", // card hover / borders
          600: "#2B2F47", // dividers
        },
        marquee: {
          // amber "spotlight" accent
          300: "#F6C177",
          400: "#F0AC4A",
          500: "#E2932E", // primary accent
          600: "#C27A1F",
        },
        signal: {
          // small semantic accents, used only for badges/status, never large fields
          rating: "#F6C177",   // IMDb-style rating chip
          series: "#6E9BF4",   // "Series" type badge
          movie: "#E2932E",    // "Movie" type badge
          mature: "#E4586E",   // age-rating badge
        },
        mist: {
          100: "#F5F6FA", // primary text on dark
          300: "#C7CAD9", // secondary text
          500: "#8A8FA8", // muted / meta text
          700: "#565B75", // placeholder text
        },
      },
      fontFamily: {
        // Display: condensed + slightly theatrical, used only for titles/hero
        display: ["'Bebas Neue'", "'Oswald'", "sans-serif"],
        // Body/UI: clean grotesque for everything else
        sans: ["'Inter'", "system-ui", "sans-serif"],
        // Meta/numeric: tabular figures for ratings, counts, badges
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "0.625rem",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -8px rgba(0,0,0,0.6)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.5), 0 16px 40px -12px rgba(226,147,46,0.18)",
        glow: "0 0 0 1px rgba(246,193,119,0.4), 0 0 24px rgba(246,193,119,0.15)",
      },
      backgroundImage: {
        "hero-fade":
          "linear-gradient(180deg, rgba(7,7,12,0) 0%, rgba(7,7,12,0.55) 55%, rgba(7,7,12,1) 100%)",
        "hero-side":
          "linear-gradient(90deg, rgba(7,7,12,0.95) 0%, rgba(7,7,12,0.55) 45%, rgba(7,7,12,0.05) 100%)",
        shimmer:
          "linear-gradient(110deg, #151726 8%, #1E2133 18%, #151726 33%)",
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
        "fade-in": "fadeIn 0.4s ease-out",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
