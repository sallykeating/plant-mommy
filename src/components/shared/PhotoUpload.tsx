import { Camera, ImagePlus, RefreshCw, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface PhotoUploadProps {
  currentUrl?: string | null;
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  className?: string;
}

export function PhotoUpload({ currentUrl, onFileSelect, onClear, className = '' }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  }

  function handleClear() {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
    onClear?.();
  }

  function openPicker() {
    inputRef.current?.click();
  }

  const displayUrl = preview ?? currentUrl;

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />
      {displayUrl ? (
        <div className="relative group">
          <img
            src={displayUrl}
            alt="Plant photo"
            className="w-full h-56 object-cover rounded-2xl"
          />
          <div className="absolute inset-0 rounded-2xl bg-forest/0 group-hover:bg-forest/30 transition-colors" />
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              type="button"
              onClick={openPicker}
              className="flex items-center gap-1.5 rounded-full bg-forest/80 px-3 py-1.5 text-xs font-medium text-cream backdrop-blur-sm transition-colors hover:bg-forest"
            >
              <RefreshCw size={13} />
              Change
            </button>
            {onClear && (
              <button
                type="button"
                onClick={handleClear}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-forest/80 text-cream backdrop-blur-sm transition-colors hover:bg-danger"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          className="w-full h-56 rounded-2xl bg-white flex flex-col items-center justify-center gap-3 text-bark-light transition-all hover:shadow-md hover:text-forest active:scale-[0.99]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage/20">
            <ImagePlus size={24} className="text-forest" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-forest">Upload a photo</p>
            <p className="text-xs text-bark-light mt-0.5">Tap to choose or take a photo</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-1.5 text-xs font-semibold text-cream">
            <Camera size={13} />
            Choose photo
          </span>
        </button>
      )}
    </div>
  );
}
