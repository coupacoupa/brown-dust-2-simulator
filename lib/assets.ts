import { ElementType } from '@/types';

// Asset locations (public/brown-dust-2-asset/…)
//
// Illustrations are referenced by file stem, e.g. 'char000101_1' →
//   inventory art:  /brown-dust-2-asset/ui/illust/illust_inven_char/illust_inven_char000101_1.png
//   costume art:    /brown-dust-2-asset/ui/illust/illust_skill_char/illust_skill_char000101_1.png

const ILLUST_ROOT = '/brown-dust-2-asset/ui/illust';

export const invenIllust = (stem: string) =>
  `${ILLUST_ROOT}/illust_inven_char/illust_inven_${stem}.png`;

export const skillIllust = (stem: string) =>
  `${ILLUST_ROOT}/illust_skill_char/illust_skill_${stem}.png`;

// In-game element icons (ui/icon/element)
export const ELEMENT_ICONS: Record<ElementType, string> = {
  water: '/brown-dust-2-asset/ui/icon/element/elementicon1_1.png',
  fire: '/brown-dust-2-asset/ui/icon/element/elementicon2_2.png',
  wind: '/brown-dust-2-asset/ui/icon/element/elementicon3_3.png',
  light: '/brown-dust-2-asset/ui/icon/element/elementicon4_4.png',
  dark: '/brown-dust-2-asset/ui/icon/element/elementicon5_5.png'
};
