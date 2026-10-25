// src/components/RequestForm.jsx
import { useState } from "react";
import { Send, Film } from "lucide-react";
import { submitMovieRequest } from "../services/mediaService";

/**
 * @param {"compact"|"full"} variant - compact for footer, full for the /request page
 */
export default function RequestForm({ variant = "compact" }) {
  const [movieName, setMovieName] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (!movieName.trim()) return;
    setStatus("submitting");
    try {
      await submitMovieRequest({ movieName: movieName.trim(), note: note.trim() });
      setMovieName("");
      setNote("");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="text-sm text-marquee-400">
        Thanks — we've got your request and will take a look.
        <button
          onClick={() => setStatus("idle")}
          className="block mt-2 text-mist-500 hover:text-mist-300 underline text-xs"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <Film size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-500" />
        <input
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
          placeholder="Enter movie or series name..."
          required
          className="w-full bg-ink-800 border border-ink-600 rounded-pill pl-9 pr-3 py-2.5 text-sm text-mist-100 placeholder:text-mist-700 focus:border-marquee-500 transition-colors"
        />
      </div>

      {variant === "full" && (
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Anything else?"
          rows={3}
          className="w-full bg-ink-800 border border-ink-600 rounded-card px-3 py-2.5 text-sm text-mist-100 placeholder:text-mist-700 focus:border-marquee-500 transition-colors resize-none"
        />
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-pill bg-marquee-500 text-ink-950 font-semibold text-sm hover:bg-marquee-400 transition-colors disabled:opacity-50"
      >
        <Send size={15} />
        {status === "submitting" ? "Submitting..." : "Submit Request"}
      </button>

      {status === "error" && (
        <p className="text-xs text-signal-mature text-center">Something went wrong — please try again.</p>
      )}
      <p className="text-[11px] text-mist-700 text-center">
        We only use this to improve the catalog — never shared.
      </p>
    </form>
  );
}
