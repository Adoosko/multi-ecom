"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export function CartStepShipping({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  // Tu môžeš pridať vlastné komponenty na výber dopravy/platby
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h2 className="text-xl font-bold mb-4">Doprava a platba</h2>
      {/* ... výber dopravy, platby ... */}
      <div className="flex gap-2 mt-8">
        <Button variant="outline" onClick={onBack}>
          Späť do košíka
        </Button>
       
      </div>
    </div>
  );
}
