// src/pages/AboutPage.jsx
// export default function AboutPage() {
//   return (
//     <div className="max-w-2xl mx-auto px-4 md:px-6 text-center py-16">
//       <h1 className="font-display text-3xl tracking-wide text-mist-100 mb-4">About Samcenebd</h1>
//       <p className="text-sm md:text-base text-mist-300 leading-relaxed">
//         CineScout is a discovery catalog for movies and TV series — think of it as a guide,
//         not a player. Every title links out to legitimate streaming, rental, or purchase
//         providers so you always know where to actually watch it.
//       </p>
//     </div>
//   );
// }

import React from "react"
import { Film, Download, ShieldCheck, Users } from "lucide-react"

const points = [
  {
    icon: Film,
    title: "Curated Catalog",
    text: "Every movie and series on Samcinebd is hand-picked and organized so you find what you want fast.",
  },
  {
    icon: Download,
    title: "Direct Downloads",
    text: "No redirects, no waiting rooms — every card links straight to your download.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Links",
    text: "Our admin team keeps every download link checked and up to date.",
  },
  {
    icon: Users,
    title: "Built for Fans",
    text: "From blockbuster premieres to binge-worthy series, Samcinebd is built around what audiences actually watch.",
  },
]

export default function AboutPage() {
  return (
     <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <h1 className="font-display text-4xl sm:text-5xl tracking-wide text-paper mt-3">
          The Story Behind Sam<span className="text-[#E2932E]">CineBD</span>
        </h1>
        <p className="text-mist mt-4 max-w-2xl mx-auto">
          Samcinebd started as a simple idea: make finding and downloading
          your next movie or TV series effortless. No clutter, no confusing
          menus, just the titles you're looking for, presented beautifully.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {points.map((p) => (
          <div
            key={p.title}
            className="bg-[#0D0E17] border border-white/5 rounded-2xl p-6 hover:border-gold/30 transition-colors"
          >
            <p.icon className="text-[#E2932E] mb-3" size={26} />
            <h3 className="font-display text-xl tracking-wide text-paper mb-1.5">
              {p.title}
            </h3>
            <p className="text-mist text-sm leading-relaxed">{p.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center bg-surface border border-[#242536] rounded-2xl p-8">
        <h2 className="font-display text-2xl tracking-wide text-[#E2932E] mb-2">
          Got a request or found a broken link?
        </h2>
        <p className="text-mist text-sm">
          Reach out through our social channels in the footer below, we read
          every message.
        </p>
      </div>
    </div>
  );
}
