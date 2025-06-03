"use client";
import Link from "next/link";

import React from 'react';
import Image from 'next/image';
// Import Swiper React komponentov a modulov
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, Parallax } from 'swiper/modules';

// Import Swiper štýlov
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';
import 'swiper/css/parallax';
// Definícia typu pre položku karuselu
interface CarouselItem {
  id: number;
  image: string;
  content: React.ReactNode; // Komponent pre obsah slidu
}

// Definuj carousel items s vlastným obsahom
const carouselItems: CarouselItem[] = [
  {
    id: 1,
    image: '/images/hero-3.webp', // Obrázok pozadia
    // Vlastný JSX obsah pre prvý slide
    content: (
      <div className="max-w-3xl">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg"
          data-swiper-parallax="-300"
          data-swiper-parallax-opacity="0.5"
          data-swiper-parallax-duration="800"
        >
          Pyroshop.sk – Pracovné Odevy & OOPP
        </h1>
        <p
          className="text-lg md:text-xl lg:text-2xl mb-8 drop-shadow-md"
          data-swiper-parallax="-200"
          data-swiper-parallax-opacity="0.7"
          data-swiper-parallax-duration="900"
        >
          Vybavte svoj tím najlepším ochranným vybavením pre maximálnu bezpečnosť.
        </p>
        <div
          data-swiper-parallax="-100"
          data-swiper-parallax-duration="1000"
        >
          <Link
            href="/kategorie/pracovne-odevy" // Opravený link
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            Nakupovať Pracovné Odevy
          </Link>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    image: '/images/hero-2.webp',
    // Vlastný JSX obsah pre druhý slide
    content: (
      <div className="max-w-3xl">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg"
          data-swiper-parallax="-300"
          data-swiper-parallax-opacity="0.5"
          data-swiper-parallax-duration="800"
        >
          Bezpečnosť na Prvom Mieste
        </h1>
        {/* Iný popis a tlačidlo */}
        <p
          className="text-lg md:text-xl lg:text-2xl mb-8 drop-shadow-md"
          data-swiper-parallax="-200"
          data-swiper-parallax-opacity="0.7"
          data-swiper-parallax-duration="900"
        >
          Profesionálne vybavenie a certifikované OOPP pre každú pracovnú výzvu. Spoľahnite sa na kvalitu.
        </p>
        <div
          data-swiper-parallax="-100"
          data-swiper-parallax-duration="1000"
        >
          <Link
            href="/kategorie/oopp" // Opravený link
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105" // Iná farba tlačidla
          >
            Preskúmať OOPP
          </Link>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    image: '/images/hero-1.webp',
    // Vlastný JSX obsah pre tretí slide
    content: (
       <div className="max-w-3xl text-center lg:text-left lg:pl-10 "> {/* Napríklad zarovnanie doľava */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg"
          data-swiper-parallax="-300"
          data-swiper-parallax-opacity="0.5"
          data-swiper-parallax-duration="800"
        >
          Hasičské Vybavenie
        </h1>
        <p
          className="text-lg md:text-xl lg:text-2xl mb-8 drop-shadow-md max-w-xl" // Obmedzená šírka textu
          data-swiper-parallax="-200"
          data-swiper-parallax-opacity="0.7"
          data-swiper-parallax-duration="900"
        >
          Špičková technika a zásahové odevy pre profesionálnych aj dobrovoľných hasičov.
        </p>
        <div
          data-swiper-parallax="-100"
          data-swiper-parallax-duration="1000"
        >
          <Link
            href="/kategorie/hasicske-vybavenie" // Opravený link
            className="inline-block bg-gray-700 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105" // Iná farba a štýl
          >
            Zobraziť Vybavenie
          </Link>
           <Link
            href="/kontakt"
            className="inline-block ml-4 text-white font-medium hover:text-gray-300 transition-colors"
          >
            Kontaktujte nás
          </Link>
        </div>
      </div>
    ),
  }
];

const HeroCarousel: React.FC = () => {
  return (
    <section className="relative w-full h-[500px] lg:h-screen overflow-hidden group"> {/* Možno vyšší na LG */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade, Parallax]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        autoplay={{
          delay: 6000, // Mierne predĺžený delay
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        parallax={true}
        speed={1200} // Trochu pomalší prechod
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{
          el: '.swiper-pagination-custom',
          clickable: true,
          renderBullet: function (index, className) {
            return `<button class="${className} w-3 h-3 rounded-full focus:outline-none transition-all bg-white/50 hover:bg-white/80"></button>`; // Jednoduchšie bullety
          },
          bulletActiveClass: '!bg-white scale-125', // Použijeme !bg-white pre istotu
          bulletClass: 'swiper-pagination-bullet mx-1 transition-transform',
        }}
        className="w-full h-full"
      >
        {carouselItems.map((item) => (
          <SwiperSlide key={item.id}>
            {/* Parallax Background */}
            <div
              className="absolute inset-0 w-full h-full"
              data-swiper-parallax="-23%"
            >
              <Image
                src={item.image}
                alt={`Hero pozadie ${item.id}`} // Všeobecnejší alt text
                fill
                sizes="100vw"
                className="object-cover"
                priority={item.id === 1}
                quality={80}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
            </div>

            {/* == ZMENA: Renderovanie vlastného obsahu == */}
            <div className="relative h-full flex items-center justify-center text-center text-white px-4 md:px-8 lg:px-16">
              {/* Priamo renderujeme item.content */}
              {item.content}
            </div>
            {/* == Koniec ZMENY == */}

          </SwiperSlide>
        ))}

        {/* Custom Navigation Arrows */}
        <button
          className="swiper-button-prev-custom absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full focus:outline-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          className="swiper-button-next-custom absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full focus:outline-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Custom Pagination Container */}
        <div className="swiper-pagination-custom absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {/* Bodky sa vyrenderujú sem */}
        </div>

      </Swiper>
    </section>
  );
};

export default HeroCarousel;
