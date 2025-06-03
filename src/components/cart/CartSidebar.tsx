"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

export function CartSidebar({ step, onStep }: { step: number; onStep: (n: number) => void }) {
  const items = useCartStore((s) => s.items);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vatRate = 0.23;
  const vat = subtotal - subtotal / (1 + vatRate);
  const total = subtotal;

  return (
    <div className="rounded-xl border border-border bg-card shadow-lg p-6 sticky top-24 backdrop-blur-md">
      <h2 className="text-lg font-bold mb-4 text-foreground tracking-tight">
        Zhrnutie objednávky
      </h2>
      <div className="flex justify-between text-base mb-2">
        <span>Medzisúčet</span>
        <span>{subtotal.toLocaleString("sk-SK", { style: "currency", currency: "EUR" })}</span>
      </div>
      <div className="flex justify-between text-base mb-2">
        <span>DPH (23%)</span>
        <span>{vat.toLocaleString("sk-SK", { style: "currency", currency: "EUR" })}</span>
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between text-xl font-extrabold mb-4">
        <span>Celkom</span>
        <span>{total.toLocaleString("sk-SK", { style: "currency", currency: "EUR" })}</span>
      </div>
      {/* CTA podľa kroku */}
      {step === 0 && (
        <Button
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md transition"
          onClick={() => onStep(1)}
        >
          Pokračovať na dopravu a platbu
        </Button>
      )}
      {step === 1 && (
        <Button
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md transition"
          onClick={() => onStep(2)}
        >
          Pokračovať na súhrn
        </Button>
      )}
      {step === 2 && (
        <Button
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md transition"
          onClick={() => onStep(3)}
        >
          Dokončiť objednávku
        </Button>
      )}
      {step === 3 && (
        <Button
          asChild
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md transition"
        >
          <Link href="/produkty">Späť do obchodu</Link>
        </Button>
      )}
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Doprava a spôsob platby sa vyberajú v ďalšom kroku.
      </p>
    </div>
  );
}
