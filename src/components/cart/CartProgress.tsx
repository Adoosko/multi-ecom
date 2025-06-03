"use client";

import React from "react";
import { CheckCircle, ShoppingCart, CreditCard, FileText, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Košík", icon: ShoppingCart },
  { label: "Doprava a platba", icon: CreditCard },
  { label: "Súhrn", icon: FileText },
  { label: "Dokončené", icon: Smile },
];

interface CartProgressProps {
  step: number; // 0 = Košík, 1 = Doprava, 2 = Súhrn, 3 = Dokončené
}

export const CartProgress: React.FC<CartProgressProps> = ({ step }) => (
  <nav
    aria-label="Progress"
    className={cn(
      "w-full max-w-3xl mx-auto mb-10 px-0 sm:px-4 select-none overflow-x-hidden"
    )}
    style={{ maxWidth: "100%" }}
  >
    <ol className="flex justify-between items-center gap-2 sm:gap-4 relative min-w-0 overflow-x-hidden">
      {/* Progress bar background */}
      <div
        className="absolute lg:top-[25%] top-[40%] left-0 right-0 h-2 bg-muted rounded-full -z-10 shadow-inner pointer-events-none"
        style={{ transform: "translateY(-50%)" }}
      />
      {/* Progress bar foreground */}
      <div
        className={cn(
          "absolute lg:top-[25%] top-[40%] left-0 h-2 z-0 rounded-full bg-primary dark:bg-red-700  transition-all duration-700 ease-[cubic-bezier(.4,1.4,.6,1)] shadow-[0_2px_12px_0_rgba(220,38,38,0.10)] pointer-events-none"
        )}
        style={{
          width:
            typeof window !== "undefined" && window.innerWidth < 640
              ? `${(step / (steps.length - 1)) * 100}%`
              : `calc(${(step / (steps.length - 1)) * 100}% + 2.5rem)`,
          minWidth: "2.5rem",
          transform: "translateY(-50%)",
        }}
      />

      {steps.map((s, idx) => {
        const Icon = s.icon;
        const isActive = idx === step;
        const isDone = idx < step;

        return (
          <li
            key={s.label}
            className="flex-1 flex flex-col items-center min-w-0 relative z-10"
            style={{ minWidth: 0 }}
          >
            <div className="relative flex flex-col items-center justify-center min-w-0">
              {/* Pulse ring for active */}
              {isActive && (
                <span className="absolute animate-pulse top-0 left-0 bg-primary/20 rounded-full w-14 h-14 z-0" />
              )}
              <div
                className={cn(
                  "flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-300 shadow-lg",
                  isDone
                    ? "bg-primary dark:bg-red-700 dark:text-white  text-primary-foreground shadow-primary/30"
                    : isActive
                    ? "bg-background border-primary text-primary shadow-primary/10"
                    : "bg-background border-muted text-muted-foreground"
                )}
                style={{
                  boxShadow: isActive
                    ? "0 4px 24px 0 rgba(220,38,38,0.13)"
                    : undefined,
                  padding: "0.5rem",
                }}
              >
                {isDone ? (
                  <CheckCircle className="w-7 h-7" />
                ) : (
                  <Icon className="w-7 h-7" />
                )}
              </div>
              {/* Číslo kroku */}
              <span
                className={cn(
                  "flex items-center justify-center text-xs font-bold px-2 py-0.5 rounded-full",
                  isActive
                    ? "bg-primary text-primary-foreground shadow"
                    : isDone
                    ? "bg-primary/80  text-primary-foreground"
                    : "bg-muted text-muted-foreground/60"
                )}
                style={{ minWidth: 28 }}
              >
                {idx + 1}
              </span>
            </div>
            {/* Názov kroku */}
            <span
              className={cn(
                "mt-4 text-base hidden md:block font-semibold text-center truncate",
                isActive
                  ? "text-primary"
                  : isDone
                  ? "text-primary/80"
                  : "text-muted-foreground"
              )}
              style={{ maxWidth: 80 }}
            >
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  </nav>
);
