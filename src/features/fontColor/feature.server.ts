// src/features/fontColor/feature.server.ts
import { createServerFeature } from '@payloadcms/richtext-lexical';

export const FontColorFeature = createServerFeature({
  feature: () => ({
    ClientFeature: '@/features/fontColor/feature.client',
  }),
  key: 'fontColor',
});
