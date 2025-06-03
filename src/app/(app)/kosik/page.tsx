"use client";
import React, { useState } from "react";
import { CartProgress } from "@/components/cart/CartProgress";
import { CartStepProducts } from "@/components/cart/CartStepProducts";
import { CartStepShipping } from "@/components/cart/CartStepShipping";
import { CartStepSummary } from "@/components/cart/CartStepSummary";
import { CartStepDone } from "@/components/cart/CartStepDone";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const steps = [
  { label: "Košík" },
  { label: "Doprava a platba" },
  { label: "Súhrn" },
  { label: "Dokončené" },
];

export default function CartPage() {
  const [step, setStep] = useState(0);
  const items = useCartStore((s) => s.items);

  if (!items.length)
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-20 px-4 text-center">
        <ShoppingCart size={56} className="mb-6 text-muted-foreground/40" />
        <h1 className="text-2xl font-bold mb-2 text-foreground">Váš košík je prázdny</h1>
        <p className="text-muted-foreground mb-6">
          Zatiaľ ste nepridali žiadny produkt do košíka.
        </p>
        <Button asChild size="lg" className="px-8">
          <Link href="/produkty">Pokračovať v nákupe</Link>
        </Button>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-8 mt-16 px-2 sm:px-4 md:px-8">
      <CartProgress step={step} />
      <h1 className="text-3xl font-extrabold mb-6 text-foreground tracking-tight px-2">
        {steps[step].label}
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <section className="flex-1">
          {step === 0 && <CartStepProducts onNext={() => setStep(1)} />}
          {step === 1 && <CartStepShipping onBack={() => setStep(0)} onNext={() => setStep(2)} />}
          {step === 2 && <CartStepSummary onBack={() => setStep(1)} onNext={() => setStep(3)} />}
          {step === 3 && <CartStepDone />}
        </section>
        <aside className="w-full lg:w-96 flex-shrink-0 mt-8 lg:mt-0">
          <CartSidebar step={step} onStep={setStep} />
        </aside>
      </div>
    </div>
  );
}
