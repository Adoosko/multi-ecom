"use client";
import { Smile } from "lucide-react";

export function CartStepDone() {
  return (
    <div className="bg-card rounded-xl border border-border p-8 text-center flex flex-col items-center">
      <Smile className="w-14 h-14 text-primary mb-4" />
      <h2 className="text-2xl font-bold mb-2">Objednávka dokončená!</h2>
      <p className="text-muted-foreground mb-4">
        Ďakujeme za váš nákup. Potvrdenie vám bolo zaslané na e-mail.
      </p>
    </div>
  );
}
