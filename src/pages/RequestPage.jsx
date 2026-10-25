// src/pages/RequestPage.jsx
import RequestForm from "../components/RequestForm";

export default function RequestPage() {
  return (
    <div className="max-w-lg mx-auto px-4 md:px-6 py-16">
      <h1 className="font-display text-3xl text-[#E2932E] tracking-wide mb-2 text-center">
        Request a Title
      </h1>
      <p className="text-sm text-mist-500 text-center mb-6">
        Can't find something in the catalog? Tell us what to add.
      </p>
      <div className="surface-card p-6">
        <RequestForm variant="full" />
      </div>
    </div>
  );
}
