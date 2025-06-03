// src/components/whychooseus/WhyChooseUs.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import BentoGridWhyChooseUs from "./BentiGrid";
import TimelineWhyChooseUs from "./Timeline";


const WhyChooseUs: React.FC = () => {
  return (
    <section className="relative w-full overflow-x-hidden bg-gradient-to-b from-black via-gray-900/95 to-black py-20 md:py-32 px-4">
      <motion.h2
        className="text-center text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-16 md:mb-24 drop-shadow-lg"
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Prečo nakupovať <span className="text-red-600">práve u nás?</span>
      </motion.h2>

      {/* Renderujeme oba, Tailwind ich zobrazí/skryje */}
      <BentoGridWhyChooseUs />
      <TimelineWhyChooseUs />

    </section>
  );
};

export default WhyChooseUs;
