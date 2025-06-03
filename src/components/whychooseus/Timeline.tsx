"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Award, Clock, LucideIcon, MessageSquareHeart, PackageSearch, Undo2, Users } from "lucide-react";

interface Reason {
  icon: LucideIcon;
  title: string;
  description: string;
}

const reasons: Reason[] = [
  {
    icon: Award,
    title: "Certifikovaná Kvalita",
    description:
      "Všetky naše produkty spĺňajú prísne európske normy a bezpečnostné štandardy.",
  },
  {
    icon: PackageSearch,
    title: "Široký Výber Skladom",
    description:
      "Tisíce položiek od overených značiek pripravených na okamžité odoslanie.",
  },
  {
    icon: Clock,
    title: "Expresné Doručenie",
    description:
      "Objednávky expedujeme rýchlo a spoľahlivo, aby bol váš tovar čo najskôr u vás.",
  },
  {
    icon: MessageSquareHeart,
    title: "Odborné Poradenstvo",
    description:
      "Náš tím expertov vám rád pomôže s výberom najvhodnejšieho vybavenia.",
  },
  {
    icon: Undo2,
    title: "Jednoduché Vrátenie",
    description:
      "Nesadol vám tovar? Bez problémov ho môžete vrátiť alebo vymeniť do 30 dní.",
  },
  {
    icon: Users,
    title: "Tisíce Spokojných Zákazníkov",
    description:
      "Prečítajte si overené recenzie a pridajte sa k našim spokojným zákazníkom.",
  },
];

export default function TimelineWhyChooseUs() {
  const timelineRef = useRef<HTMLUListElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="md:hidden relative max-w-md mx-auto px-2  py-10">
      <div className="relative">
        {/* Sivá pozadie osi */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gray-700 rounded-full" />
        {/* Červená animovaná čiara */}
        <motion.div
          className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-red-600 rounded-full origin-top"
          style={{ scaleY: lineScaleY }}
        />
        <ul
          ref={timelineRef}
          className="relative space-y-20"
          aria-label="Timeline výhod prečo si vybrať nás"
        >
          {reasons.map((reason, idx) => {
            const alignRight = idx % 2 === 1;
            return (
              <li
                key={idx}
                className={`relative w-[90%] flex flex-col items-center ${
                  alignRight ? "items-end" : "items-start"
                }`}
              >
                {/* Ikona na osi */}
                <div className="absolute left-[55%] -top-10 -translate-x-1/2 w-14 h-14 rounded-full bg-red-600 text-white shadow-lg ring-4 ring-black/30 flex items-center justify-center z-20">
                  <reason.icon className="h-7 w-7" />
                </div>

                {/* Textová karta */}
                <div
                  className={`w-[80%] bg-black/70 backdrop-blur-md rounded-2xl p-8 shadow-xl text-white ${
                    alignRight ? "text-right" : "text-left"
                  }`}
                  
                >
                  <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
                  <p className="text-gray-300">{reason.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
