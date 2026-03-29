import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { usePlants } from '@/hooks/usePlants';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { HEALTH_STATUS_LABELS } from '@/lib/types';
import type { Plant } from '@/lib/types';
import { healthStatusColor } from '@/lib/helpers';

function PlantCard({ plant, onNavigate }: { plant: Plant; onNavigate: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(plant.id)}
      className="card-interactive w-full text-left"
    >
      <div className="flex gap-4">
        <div className="shrink-0 w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-sage-light to-sage-muted flex items-center justify-center">
          {plant.photo_url ? (
            <img src={plant.photo_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl" aria-hidden>
              🪴
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 flex flex-col justify-center gap-1">
          <h3 className="font-display font-semibold text-forest truncate">{plant.name}</h3>
          <p className="text-sm text-bark-light truncate">{plant.species ?? 'Species unknown'}</p>
          {plant.location && (
            <p className="text-xs text-bark-light/70 truncate">{plant.location}</p>
          )}
          <span
            className={`mt-1 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${healthStatusColor(plant.health_status)}`}
          >
            {HEALTH_STATUS_LABELS[plant.health_status]}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function PlantsPage() {
  const navigate = useNavigate();
  const { plants, loading } = usePlants();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return plants;
    return plants.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.species?.toLowerCase().includes(q) ?? false) ||
        (p.location?.toLowerCase().includes(q) ?? false)
    );
  }, [plants, query]);

  return (
    <div className="page-container relative min-h-[60vh]">
      <header className="mb-6">
        <h1 className="page-title">My Jungle</h1>
        <p className="page-subtitle">Your living collection</p>

        <div className="relative">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-bark-light/50 pointer-events-none"
            size={18}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, species, or room…"
            className="input-field pl-12"
            aria-label="Search plants"
          />
        </div>
      </header>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="card">
          {plants.length === 0 ? (
            <EmptyState
              icon="🌿"
              title="No plants yet"
              description="Add your first plant to start tracking care, light, and growth."
              action={{ label: 'Add a plant', onClick: () => navigate('/plants/new') }}
            />
          ) : (
            <EmptyState
              icon="🔍"
              title="No matches"
              description="Try a different search term or clear the filter."
              action={{ label: 'Clear search', onClick: () => setQuery('') }}
            />
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-3 pb-4 lg:grid lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map((plant) => (
            <li key={plant.id}>
              <PlantCard plant={plant} onNavigate={(id) => navigate(`/plants/${id}`)} />
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/plants/new"
        className="fixed bottom-24 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-cream shadow-lg shadow-forest/30 transition-transform hover:bg-forest-light active:scale-95 lg:bottom-8 lg:right-8"
        aria-label="Add plant"
      >
        <Plus size={28} strokeWidth={2.25} />
      </Link>
    </div>
  );
}
