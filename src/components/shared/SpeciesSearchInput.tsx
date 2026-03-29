import { useRef, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { useSpeciesSearch } from '@/hooks/useSpeciesSearch';
import type { TrefleSpeciesListItem } from '@/lib/trefle';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSpeciesSelect?: (species: TrefleSpeciesListItem) => void;
  id?: string;
  placeholder?: string;
}

export function SpeciesSearchInput({
  value,
  onChange,
  onSpeciesSelect,
  id,
  placeholder = 'e.g. Monstera deliciosa',
}: Props) {
  const { search, results, loading, clearResults } = useSpeciesSearch();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function handleInputChange(val: string) {
    onChange(val);
    search(val);
    setOpen(true);
  }

  function handleSelect(item: TrefleSpeciesListItem) {
    onChange(item.common_name ?? item.scientific_name);
    onSpeciesSelect?.(item);
    clearResults();
    setOpen(false);
  }

  function handleBlur() {
    blurTimeoutRef.current = setTimeout(() => setOpen(false), 200);
  }

  function handleFocus() {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    if (results.length > 0) setOpen(true);
  }

  const showDropdown = open && (results.length > 0 || loading);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage pointer-events-none"
          size={16}
          aria-hidden
        />
        <input
          id={id}
          type="text"
          className="input-field pl-10 pr-10"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
        />
        {loading && (
          <Loader2
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sage animate-spin"
            size={16}
          />
        )}
      </div>

      {showDropdown && (
        <ul
          className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-72 overflow-y-auto rounded-2xl bg-white shadow-xl"
          role="listbox"
        >
          {loading && results.length === 0 ? (
            <li className="flex items-center gap-2 px-4 py-3 text-sm text-sage">
              <Loader2 size={14} className="animate-spin" />
              Searching plants…
            </li>
          ) : (
            results.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-sage/15 focus:bg-sage/15 focus:outline-none"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(item)}
                  role="option"
                  aria-selected={false}
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-sage-muted/30">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-lg">
                        🌿
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-forest">
                      {item.common_name ?? item.scientific_name}
                    </p>
                    <p className="truncate text-xs text-sage">
                      {item.scientific_name}
                    </p>
                    {item.family && (
                      <p className="mt-0.5 text-[10px] text-bark-light">
                        🌿 {item.family_common_name ?? item.family}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
