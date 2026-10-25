// src/pages/DownloadPage.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Download, ExternalLink, Bell, CheckCircle2, ShieldCheck, ArrowLeft } from "lucide-react";

export default function DownloadPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Details.jsx থেকে পাঠানো ডাটা
  const { targetUrl, title, providerName } = location.state || {};

  const TOTAL_SECONDS = 6;
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // সরাসরি এই পেজে আসলে বা লিংক না থাকলে হোমপেজে রিডাইরেক্ট করবে
    if (!targetUrl) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetUrl]);

  if (!targetUrl) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl text-mist-100 mb-3">No active link found!</h2>
        <p className="text-mist-500 mb-6">Please select a movie or series to download.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-pill bg-marquee-500 text-ink-950 font-bold text-sm hover:bg-marquee-400 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    );
  }

  // Circular progress calculation
  const strokeDashoffset = 283 - (283 * (TOTAL_SECONDS - timeLeft)) / TOTAL_SECONDS;

  const domainMirrors = [
    "samcine.co",
    "samcine.xyz",
    "samcine.me",
    "samcine.my",
    "samcine.art",
    "samcine.lat",
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
      {/* Main Container Card */}
      <div className="w-full bg-ink-900/90 border border-ink-600/60 rounded-2xl p-6 md:p-8 text-center shadow-2xl backdrop-blur-md">
        
        {/* Header */}
        <div className="flex items-center justify-center gap-2 text-marquee-400 font-medium text-lg mb-1">
          ✨ Your Download Link Is Being Prepared
        </div>
        <p className="text-sm text-mist-300 font-display text-xl mb-6">
          {title ? `${title} (${providerName || "Download"})` : "Preparing Link..."}
        </p>

        {/* Counter Circle Display */}
        <div className="relative w-36 h-36 mx-auto my-4 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Track Background */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-ink-800"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-marquee-500 transition-all duration-1000 ease-linear"
              strokeWidth="6"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-4xl text-mist-100 font-bold">
              {timeLeft}
            </span>
          </div>
        </div>

        <p className="text-xs text-mist-400 mb-8 font-mono">
          {!isReady ? "⌛ Please wait until the time runs out" : "✅ Link generation complete!"}
        </p>

        {/* Ready Download Button */}
        {isReady && (
          <div className="mb-8 animate-fadeIn">
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 rounded-pill bg-marquee-500 text-ink-950 font-bold text-base hover:bg-marquee-400 transition-all transform hover:scale-105 shadow-xl"
            >
              <Download size={20} /> Continue to Final Link <ExternalLink size={16} />
            </a>
          </div>
        )}

        {/* Notice & Domain Update Box */}
        <div className="bg-ink-950/80 border border-signal-mature/30 rounded-xl p-5 text-left mb-6 relative overflow-hidden">
          <div className="flex items-center gap-2 text-signal-mature font-semibold mb-2">
            <Bell size={18} className="animate-bounce" />
            <span>জরুরী নোটিশ / ডোমেইন আপডেট</span>
          </div>
          
          <p className="text-xs md:text-sm text-mist-300 leading-relaxed mb-4">
            আমাদের মেইন ডোমেইন কাজ না করলে, বা ওয়েবসাইটে ঢুকতে না পারলে{" "}
            <span className="text-marquee-400 font-bold">SAMCINE.NET</span> -এ ভিজিট করবেন, তাহলে লেটেস্ট ডোমেইন পেয়ে যাবেন। এছাড়া আমাদের অন্যান্য ডোমেইনসমূহ:
          </p>

          {/* Domain Mirrors Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-ink-800">
            {domainMirrors.map((domain) => (
              <div
                key={domain}
                className="flex items-center gap-1.5 text-xs text-mist-300 bg-ink-900/60 px-2.5 py-1.5 rounded-md border border-ink-800"
              >
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span className="truncate">{domain}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-mist-500">
          <ShieldCheck size={14} className="text-marquee-400" />
          <span>Safe & Direct Link Verification</span>
        </div>

      </div>
    </div>
  );
}