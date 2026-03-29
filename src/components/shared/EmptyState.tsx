interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="font-display text-lg font-semibold text-forest mb-2">{title}</h3>
      <p className="text-bark-light text-sm mb-6 max-w-xs">{description}</p>
      {action && (
        <button onClick={action.onClick} className="btn-primary text-sm">
          {action.label}
        </button>
      )}
    </div>
  );
}
