"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import ReasonItem from "./ReasonItem";
import {
  ShieldCheck,
  Truck,
  Box,
  MessageCircle,
  PhoneCall,
  Award,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const reasonsData = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Certifikovaná Ochrana",
    description:
      "Ponúkame iba certifikované pracovné odevy a vybavenie spĺňajúce najvyššie bezpečnostné normy (EN, ISO). Vaša bezpečnosť je naša priorita.",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    icon: <Box className="w-6 h-6" />,
    title: "Široký Sortiment",
    description:
      "Od montérok a topánok až po špecializované hasičské vybavenie - všetko skladom.",
    className: "md:col-span-1",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Rýchle Dodanie",
    description:
      "Väčšinu tovaru expedujeme do 24 hodín spoľahlivými dopravcami.",
    className: "md:col-span-1",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Odborné Poradenstvo",
    description: "Náš tím vám pomôže vybrať správne vybavenie pre vaše potreby.",
    className: "md:col-span-1",
  },
  {
    icon: <PhoneCall className="w-6 h-6" />,
    title: "Zákaznícka Podpora",
    description:
      "Sme tu pre vás - pred, počas aj po nákupe. Kontaktujte nás kedykoľvek.",
    className: "md:col-span-1",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Kvalitné Značky",
    description:
      "Spolupracujeme len s overenými výrobcami garantujúcimi kvalitu a životnosť.",
    className: "md:col-span-2",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Overené Tisíckami",
    description: (
      <>
        Dôverujú nám profesionáli aj firmy po celom Slovensku. Prečítajte si ich{" "}
        <a href="#reviews" className="text-red-400 hover:underline">
          recenzie
        </a>
        .
      </>
    ),
    className: "md:col-span-2",
    cta: (
      <Button
        variant="ghost"
        className="text-red-400 p-0 h-auto hover:bg-transparent hover:text-red-300"
      >
        Staňte sa našim partnerom <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const BentoGridWhyChooseUs: React.FC = () => {
  return (
    <motion.div
      className="hidden md:grid max-w-6xl mx-auto grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {reasonsData.map((reason, index) => (
        <ReasonItem
          key={index}
          icon={reason.icon}
          title={reason.title}
          description={reason.description}
          className={reason.className}
          cta={reason.cta}
          animationDelay={index * 150} // Delay v ms pre AnimateOnScroll
        />
      ))}
    </motion.div>
  );
};

export default BentoGridWhyChooseUs;
