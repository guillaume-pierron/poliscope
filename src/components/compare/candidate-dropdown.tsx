"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/lib/types";

/**
 * Liste déroulante de candidats. Un `<select>` natif rend son propre menu
 * hors de portée du CSS — sur Windows, une simple liste de texte, sans
 * portrait ni parti, qui tranche avec le reste du site. Ce composant
 * reconstruit le menu à la main pour qu'il ait la même apparence ouvert que
 * fermé, tout en gardant le comportement clavier attendu d'un menu
 * (`role="listbox"`, Échap, flèches, fermeture au clic extérieur).
 */
export function CandidateDropdown({
  candidates,
  placeholder,
  onSelect,
}: {
  candidates: Candidate[];
  placeholder: string;
  onSelect: (candidate: Candidate) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        rootRef.current?.querySelector("button")?.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, candidates.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const c = candidates[activeIndex];
        if (c) {
          setOpen(false);
          onSelect(c);
        }
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, activeIndex, candidates, onSelect]);

  // L'option en surbrillance reste visible quand on la déplace au clavier.
  useEffect(() => {
    if (!open) return;
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setActiveIndex(0);
          setOpen((v) => !v);
        }}
        className="focus-ring flex w-full items-center justify-between gap-2 rounded-xl border border-border-strong bg-card px-3.5 py-2.5 text-sm transition-colors hover:bg-surface"
      >
        <span className="text-muted">{placeholder}</span>
        <ChevronDown
          size={16}
          className={cn("shrink-0 text-muted-2 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="absolute z-20 mt-1.5 max-h-72 w-full overflow-y-auto rounded-xl border border-border-strong bg-card p-1.5 shadow-[0_16px_40px_-16px_rgba(15,23,41,0.25)]"
        >
          {candidates.map((c, i) => (
            <li key={c.id} role="option" aria-selected={false}>
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => {
                  setOpen(false);
                  onSelect(c);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                  i === activeIndex ? "bg-primary-soft" : "hover:bg-surface"
                )}
              >
                <CandidateAvatar
                  name={c.name}
                  color={c.party?.color}
                  photoUrl={c.photo_url}
                  size="sm"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{c.name}</span>
                  <span className="block truncate text-xs text-muted-2">
                    {c.party?.name ?? "Sans étiquette"}
                  </span>
                </span>
                {i === activeIndex && (
                  <Check size={15} className="shrink-0 text-primary" aria-hidden="true" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
