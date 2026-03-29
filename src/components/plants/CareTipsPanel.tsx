import { Loader2, Sparkles } from 'lucide-react';
import { useSpeciesDetails } from '@/hooks/useSpeciesSearch';

export function CareTipsPanel({ speciesName }: { speciesName: string | null | undefined }) {
  const { detail, careTips, loading } = useSpeciesDetails(speciesName);

  if (!speciesName) return null;

  if (loading) {
    return (
      <div className="card flex items-center justify-center gap-2 py-8 text-sage">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Loading care tips…</span>
      </div>
    );
  }

  if (!detail || careTips.length === 0) return null;

  const heroImage = detail.image_url
    ?? detail.images?.habit?.[0]?.image_url
    ?? detail.images?.flower?.[0]?.image_url
    ?? detail.images?.leaf?.[0]?.image_url;

  const description = detail.growth?.description ?? detail.observations;

  return (
    <div className="space-y-3">
      {heroImage && (
        <div className="overflow-hidden rounded-2xl">
          <img
            src={heroImage}
            alt={detail.common_name ?? detail.scientific_name}
            className="h-48 w-full object-cover"
          />
        </div>
      )}

      {description && (
        <div className="card bg-sage/15">
          <div className="flex items-start gap-2.5">
            <Sparkles size={16} className="mt-0.5 shrink-0 text-forest" />
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-forest">
                About this species
              </p>
              <p className="text-sm leading-relaxed text-bark-light">
                {description.length > 300
                  ? description.slice(0, 300).trim() + '…'
                  : description}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {careTips.map((tip) => (
          <div
            key={tip.category}
            className="card flex flex-col gap-1 bg-white px-3.5 py-3"
          >
            <span className="text-lg leading-none" aria-hidden>
              {tip.icon}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-sage">
              {tip.category}
            </span>
            <span className="text-sm font-medium text-forest">{tip.value}</span>
            {tip.detail && (
              <span className="text-xs text-bark-light">{tip.detail}</span>
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-[10px] text-sage/70">
        Care data from Trefle.io
      </p>
    </div>
  );
}
