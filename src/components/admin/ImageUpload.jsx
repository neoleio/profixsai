import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";

const MAX_DIMENSION = 900;
const JPEG_QUALITY = 0.75;

// Resizes/compresses in the browser before it ever reaches the API — keeps
// the stored data URL small since there's no external file storage wired up
// for this project (everything runs on Vercel + Neon free tiers).
function fileToCompressedDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file doesn't look like a valid image."));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ImageUpload({ value, onChange, label = "Image", mode = "full" }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      onChange(dataUrl);
    } catch (err) {
      setError(err.message || "Couldn't process that image.");
    } finally {
      setBusy(false);
    }
  }

  // "button" mode skips the built-in thumbnail — used when the caller
  // already renders its own preview above this control (e.g. slide cards).
  if (mode === "button") {
    return (
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:text-brand-blueDeep disabled:opacity-50"
        >
          {busy ? <Loader2 size={12} className="animate-spin" /> : <ImagePlus size={12} />}
          {busy ? "Processing..." : `Replace ${label.toLowerCase()}`}
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        {error && <p className="text-xs text-brand-red mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative">
            <img src={value} alt="" className="w-16 h-16 rounded-lg object-cover border border-ink/10" />
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Remove image"
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-ink text-white grid place-items-center hover:bg-brand-red"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg border border-dashed border-ink/20 grid place-items-center text-ink/30">
            <ImagePlus size={20} />
          </div>
        )}
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blueDeep disabled:opacity-50"
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
            {busy ? "Processing..." : value ? `Replace ${label.toLowerCase()}` : `Add ${label.toLowerCase()}`}
          </button>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          {error && <p className="text-xs text-brand-red mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}
