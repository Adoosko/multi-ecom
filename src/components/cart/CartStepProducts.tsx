"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import QuantitySelector from "@/components/ui/quantity-selector";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

export function CartStepProducts({ onNext }: { onNext: () => void }) {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  return (
    <>
      <div className="rounded-xl border border-border bg-card shadow-sm px-0 sm:px-2 py-3">
        {items.map((item, idx) => (
          <div
            key={item.variantId}
            className={cn(
              "flex gap-4 py-5 px-2 sm:px-6 rounded-xl group hover:bg-muted/40 transition items-start sm:items-center",
              idx !== items.length - 1 && "mb-2 border-b border-border"
            )}
          >
            <div className="relative w-24 h-24 flex-shrink-0 rounded-lg border border-border bg-muted/40 overflow-hidden shadow-sm">
              <Image
                src={item.image || "/images/placeholder.png"}
                alt={item.title}
                fill
                className="object-contain"
                sizes="96px"
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <Link
                  href={`/produkty/${item.productId}`}
                  className="font-semibold text-base sm:text-lg text-foreground hover:text-primary transition-colors truncate block"
                >
                  {item.title}
                </Link>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  {item.color && (
                    <span className="flex items-center gap-1">
                      <span
                        className="inline-block w-4 h-4 rounded-full border border-border shadow-sm"
                        style={{
                          backgroundColor: item.color || "#eee",
                        }}
                      />
                    </span>
                  )}
                  {item.size && (
                    <span className="inline-block px-2 py-0.5 rounded bg-accent text-xs font-bold text-accent-foreground border border-accent shadow-sm">
                      {item.size}
                    </span>
                  )}
                  {item.sku && (
                    <span className="ml-2 text-xs">SKU: {item.sku}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-bold text-foreground">
                    {item.price.toLocaleString("sk-SK", { style: "currency", currency: "EUR" })}
                  </span>
                  <span className="text-xs text-muted-foreground">s DPH</span>
                </div>
              </div>
              <div className="flex sm:hidden mt-2 items-center gap-2">
                <span className="text-xs text-muted-foreground">Spolu:</span>
                <span className="font-bold text-foreground">
                  {(item.price * item.quantity).toLocaleString("sk-SK", { style: "currency", currency: "EUR" })}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 min-w-[110px]">
              <div className="flex flex-row items-center gap-2">
                <QuantitySelector
                  quantity={item.quantity}
                  minQuantity={1}
                  maxQuantity={99}
                  onChange={(q) => updateQuantity(item.variantId, q)}
                  className="w-20 md:w-full"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full bg-background/70 hover:bg-destructive/10 transition"
                  onClick={() => removeItem(item.variantId)}
                  aria-label="Odstrániť položku"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
              <span className="hidden sm:block text-xs text-muted-foreground font-semibold">
                {(item.price * item.quantity).toLocaleString("sk-SK", { style: "currency", currency: "EUR" })}
              </span>
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center p-3 sm:p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={clearCart}
            className="rounded-full"
          >
            Vyprázdniť košík
          </Button>
          <span className="text-xs text-muted-foreground">
            Celkom položiek: <b>{items.reduce((sum, i) => sum + i.quantity, 0)}</b>
          </span>
        </div>
      </div>
     
    </>
  );
}
