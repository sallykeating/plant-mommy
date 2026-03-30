import { useState } from 'react';

const PLANT_EMOJIS = [
  // Leaves & greenery
  '🌿', '🌱', '🪴', '🍃', '🍀', '☘️', '🌾', '🍂', '🍁', '🍄',
  // Flowers
  '🌸', '🌺', '🌻', '🌼', '🌷', '🌹', '🪻', '🪷', '💐', '🏵️',
  // Trees & palms
  '🌴', '🌳', '🌲', '🎋', '🎍', '🎄', '🪹', '🪺',
  // Fruits & veggies
  '🫒', '🥑', '🍋', '🍓', '🍑', '🍊', '🍇', '🍉', '🍎', '🍐',
  '🍌', '🥝', '🥥', '🍈', '🍒', '🫐', '🥭', '🍍', '🥬', '🥦',
  '🥕', '🌽', '🍆', '🫑', '🌶️', '🧄', '🧅', '🥔', '🍅', '🫛',
  // Cacti & succulents
  '🌵', '🪨', '🏜️',
  // Nature & garden
  '🦋', '🐝', '🐌', '🐛', '🐞', '🪲', '🐸', '🦎', '🐢', '🪱',
  // Vibes & elements
  '💚', '💧', '☀️', '🌙', '🌈', '🌰', '✨', '🫧', '🧪', '💜',
  '💛', '🩷', '🤍', '🩵', '🧡', '❤️',
];

interface Props {
  value: string;
  onChange: (emoji: string) => void;
}

export function EmojiPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 rounded-2xl bg-white border-[1.5px] border-sage-muted px-4 py-3 transition-all hover:border-forest focus:outline-none focus:ring-3 focus:ring-forest/18"
      >
        <span className="text-3xl leading-none">{value}</span>
        <div className="text-left">
          <p className="text-sm font-semibold text-forest">Plant emoji</p>
          <p className="text-xs text-bark-light">Tap to change</p>
        </div>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 sm:left-0 top-full z-50 mt-2 w-80 max-h-64 overflow-y-auto rounded-2xl bg-white p-3 shadow-xl border border-sage-muted/50">
            <div className="grid grid-cols-8 gap-1.5">
              {PLANT_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => { onChange(emoji); setOpen(false); }}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-xl transition-all hover:scale-110 hover:bg-sage/20 active:scale-95 ${
                    value === emoji ? 'bg-forest/15 ring-2 ring-forest' : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
