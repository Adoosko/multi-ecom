// src/features/fontColor/feature.client.ts
"use client";

import {
  createClientFeature,
  toolbarFeatureButtonsGroupWithItems,
} from '@payloadcms/richtext-lexical/client';

import { DropdownColorPicker } from './components/DropdownColorPicker';

export default createClientFeature({
  toolbarFixed: {
    groups: [
      toolbarFeatureButtonsGroupWithItems([
        {
          key: 'fontColor',
          label: 'Text Color',
          Component: DropdownColorPicker,
        },
      ]),
    ],
  },
});