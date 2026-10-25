// src/admin/components/Modal.jsx
import { X } from "lucide-react";

export default function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/60 overflow-y-auto">
      <div className={`w-full ${wide ? "max-w-3xl" : "max-w-md"} max-h-[92vh] overflow-y-auto surface-card p-4 sm:p-6 my-4 sm:my-0`}>
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="font-display text-lg sm:text-xl tracking-wide text-mist-100">{title}</h2>
          <button onClick={onClose} className="text-mist-500 hover:text-mist-100 shrink-0">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
