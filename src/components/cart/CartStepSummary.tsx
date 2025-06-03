/* eslint-disable */
"use client";
import { Button } from "@/components/ui/button";

export function CartStepSummary({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  // Tu môžeš pridať vlastné komponenty na súhrn objednávky
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h2 className="text-xl font-bold mb-4">Súhrn objednávky</h2>
      {/* ... súhrn objednávky ... */}
      <div className="flex gap-2 mt-8">
        <Button variant="outline" onClick={onBack}>
          Späť
        </Button>
      </div>
    </div>
  );
}
