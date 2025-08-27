import React, { useState } from 'react';

export default function Tooltip({ term, text }: { term: string; text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center gap-1">
      <span
        className="underline decoration-dotted cursor-help"          onMouseEnter={() => setOpen(true)}          onMouseLeave={() => setOpen(false)}        >{term}</span>
      {open && (
        <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-pre text-sm text-white bg-black/80 border border-white/10 rounded-lg px-3 py-2 backdrop-blur-md shadow-lg z-10 max-w-xs">
          {text}
        </span>
      )}
    </span>
  );
}
