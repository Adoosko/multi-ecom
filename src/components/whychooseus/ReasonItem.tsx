"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AnimateOnScroll } from "@/components/ui/scroll-animation";

interface ReasonItemProps {
  className?: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  cta?: React.ReactNode;
  animationDelay?: number;
}

export default function ReasonItem({
  className,
  icon,
  title,
  description,
  cta,
  animationDelay = 0,
}: ReasonItemProps) {
  return (
    <AnimateOnScroll
      animation="scale-up"
      delay={animationDelay}
      className={cn(
        "relative rounded-2xl overflow-hidden p-6 md:p-8 flex flex-col h-full bg-black/60 backdrop-blur-md border border-gray-800/80 shadow-xl",
        className
      )}
      duration={500}
    >
      <div className="mb-5 flex-shrink-0">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-xl shadow-lg">
          {icon}
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 leading-tight">
          {title}
        </h3>
        <div className="text-base text-gray-300 leading-relaxed flex-grow">
          {description}
        </div>
        {cta && <div className="mt-6 pt-4 border-t border-gray-700/50">{cta}</div>}
      </div>
    </AnimateOnScroll>
  );
}
