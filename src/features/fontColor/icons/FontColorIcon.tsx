// src/features/fontColor/icons/FontColorIcon.tsx
"use client";
import React from 'react';
import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & { underscoreColor?: string | null };

export function FontColorIcon({ underscoreColor, ...props }: Props) {
  // Predvolená farba ikony, ak nie je nič vybrané alebo je farba nedefinovaná
  const iconColor = underscoreColor ? 'currentColor' : '#888888'; // Sivá pre "???"

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: '5px', // Podľa článku
        border: 'none',
        outline: 'none',
      }}
      id="lexical-font-color-icon"
    >
      <svg
        viewBox="0 0 18.427431 19.958412"
        xmlns="http://www.w3.org/2000/svg"
        width="20px"
        height="10px"
        opacity={underscoreColor ? '1' : '0.7'} // Plná opacita, ak je farba, inak slabšia
        fill={iconColor} // Použijeme vypočítanú farbu
        {...props} // Ostatné SVG props
      >
        {/* Path 'A' z článku */}
        <path
          d="m 63.703631,73.042 -1.94852,-5.483692 H 54.155883 L 52.235199,73.042 h -3.4795 l 7.404376,-19.958413 h 3.61868 L 67.183131,73.042 Z M 58.999347,59.346688 q -0.111344,-0.334032 -0.306196,-0.97426 -0.194852,-0.668064 -0.41754,-1.336128 -0.194852,-0.6959 -0.306196,-1.141276 -0.13918,0.55672 -0.334032,1.25262 -0.194852,0.6959 -0.389704,1.308292 -0.167016,0.584556 -0.27836,0.890752 l -1.865012,5.372348 h 5.762052 z"
          id="text1"
          aria-label="A"
        />
      </svg>
      {/* Podčiarknutie alebo otázniky */}
      {underscoreColor ? (
        <div
          style={{
            marginTop: '3px',
            width: '20px',
            height: '3px',
            backgroundColor: underscoreColor, // Zobrazí aktuálnu farbu
            borderRadius: '1px',
          }}
        />
      ) : (
         // Neistá farba (ak je výber zmiešaný alebo žiadny)
         // Použijeme gradient pre zaujímavejší vzhľad
         <div
            style={{
                marginTop: '3px',
                width: '20px',
                height: '3px',
                background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
                borderRadius: '1px',
            }}
         />
        // Alternatíva z článku:
        // <div style={{ fontSize: '8px', marginTop: '1px', color: '#888888' }}>???</div>
      )}
    </div>
  );
}
