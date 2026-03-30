import { useRef, useState } from 'react';
import { Camera, Loader2, ScanSearch, X, Check, Leaf } from 'lucide-react';
import { identifyPlant, type PlantNetResult } from '@/lib/plantnet';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (result: PlantNetResult, imageFile: File) => void;
}

export function PlantIdentifyModal({ open, onClose, onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<PlantNetResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  function reset() {
    setPreview(null);
    setFile(null);
    setResults([]);
    setError(null);
    setSelectedIdx(null);
    setLoading(false);
    if (inputRef.current) inputRef.current.value = '';
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResults([]);
    setError(null);
    setSelectedIdx(null);
  }

  async function handleIdentify() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await identifyPlant(file);
      if (response.results.length === 0) {
        setError('No plants recognized. Try a clearer or closer photo.');
      } else {
        setResults(response.results);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Identification failed');
    } finally {
      setLoading(false);
    }
  }

  function handleConfirm() {
    if (selectedIdx == null || !file) return;
    onSelect(results[selectedIdx], file);
    handleClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-forest/40 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative z-10 w-full max-w-lg max-h-[90dvh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white/95 backdrop-blur-md px-5 pt-5 pb-3 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sage/20">
              <ScanSearch size={18} className="text-forest" />
            </div>
            <h2 className="text-lg font-bold text-forest font-[var(--font-display)]">
              Identify plant
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-sage/20 transition-colors"
          >
            <X size={18} className="text-bark-light" />
          </button>
        </div>

        <div className="px-5 pb-6 space-y-5">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Photo area */}
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Plant to identify"
                className="w-full h-56 object-cover rounded-2xl"
              />
              <button
                type="button"
                onClick={() => { reset(); inputRef.current?.click(); }}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-forest/80 px-3 py-1.5 text-xs font-medium text-cream backdrop-blur-sm hover:bg-forest transition-colors"
              >
                <Camera size={13} />
                Retake
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full h-48 rounded-2xl bg-sage/10 border-2 border-dashed border-sage-muted flex flex-col items-center justify-center gap-3 transition-all hover:border-forest hover:bg-sage/20 active:scale-[0.99]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest/10">
                <Camera size={24} className="text-forest" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-forest">Take or upload a photo</p>
                <p className="text-xs text-bark-light mt-0.5">Get a close-up of a leaf or flower</p>
              </div>
            </button>
          )}

          {/* Identify button */}
          {preview && results.length === 0 && !loading && (
            <button
              type="button"
              onClick={handleIdentify}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <ScanSearch size={16} />
              Identify this plant
            </button>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 size={28} className="text-forest animate-spin" />
              <p className="text-sm text-bark-light font-medium">Analyzing your photo...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-2xl bg-danger/10 px-4 py-3 text-center">
              <p className="text-sm text-danger">{error}</p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-2 text-xs font-semibold text-forest underline"
              >
                Try another photo
              </button>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-bark-light uppercase tracking-wide">
                Possible matches
              </p>
              <ul className="space-y-2">
                {results.map((r, i) => {
                  const pct = Math.round(r.score * 100);
                  const isSelected = selectedIdx === i;
                  return (
                    <li key={r.species.scientificNameWithoutAuthor}>
                      <button
                        type="button"
                        onClick={() => setSelectedIdx(i)}
                        className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all ${
                          isSelected
                            ? 'bg-forest text-cream shadow-lg scale-[1.01]'
                            : 'bg-sage/10 hover:bg-sage/20'
                        }`}
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          isSelected ? 'bg-cream/20' : 'bg-forest/10'
                        }`}>
                          {isSelected ? (
                            <Check size={18} className="text-cream" />
                          ) : (
                            <Leaf size={16} className="text-forest" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-semibold truncate ${isSelected ? 'text-cream' : 'text-forest'}`}>
                            {r.species.commonNames[0] ?? r.species.scientificNameWithoutAuthor}
                          </p>
                          <p className={`text-xs truncate ${isSelected ? 'text-cream/70' : 'text-bark-light'}`}>
                            {r.species.scientificNameWithoutAuthor}
                          </p>
                        </div>
                        <div className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                          isSelected
                            ? 'bg-cream/20 text-cream'
                            : pct >= 70 ? 'bg-forest/10 text-forest'
                            : pct >= 40 ? 'bg-sun/20 text-terracotta-dark'
                            : 'bg-sage/20 text-bark-light'
                        }`}>
                          {pct}%
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={selectedIdx == null}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
              >
                <Check size={16} />
                Use this species
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
