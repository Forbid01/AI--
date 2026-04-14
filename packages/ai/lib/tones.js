export const tones = {
  formal: {
    id: 'formal',
    label: { mn: 'Албан ёсны', en: 'Formal' },
    systemHint:
      'Албан ёсны, хүндэтгэлтэй, мэргэжлийн өнгө аяс. "Та" хэлбэрийг ашигла. Хэт дотно үг, slang-аас зайлсхий. Өгүүлбэр бүрэн бүтэн, тодорхой.',
    systemHintEn:
      'Use a formal, respectful, professional tone. Use "you" formally. Avoid slang and overly casual phrasing. Write complete, precise sentences.',
  },
  friendly: {
    id: 'friendly',
    label: { mn: 'Найрсаг', en: 'Friendly' },
    systemHint:
      'Дулаахан, найрсаг, ойр дотно боловч мэргэжлийн өнгө аяс. "Та" ашиглах боловч уншигчтай шууд ярилцаж буй мэт. Хэт албан биш.',
    systemHintEn:
      'Warm, friendly, conversational yet professional. Speak directly to the reader. Avoid being stiff or overly formal.',
  },
  premium: {
    id: 'premium',
    label: { mn: 'Премиум', en: 'Premium' },
    systemHint:
      'Гоёмсог, товч, нэр хүндтэй өнгө аяс. Бүтээгдэхүүний чанар, онцгой байдлыг онцлон тэмдэглэ. Хэт их хэтрүүлэг, восклицание үгүй. Үг сонголт чанартай.',
    systemHintEn:
      'Elegant, concise, prestigious tone. Emphasize quality and exclusivity. No exclamation marks or over-hype. Curate word choice.',
  },
  sales: {
    id: 'sales',
    label: { mn: 'Борлуулалт төвтэй', en: 'Sales-driven' },
    systemHint:
      'Үйлдэлд уриалсан, ашиг тусыг онцолсон, CTA давтсан өнгө аяс. Тоо, хугацаатай саналыг онцолно. Гэхдээ хэт түрэмгий биш.',
    systemHintEn:
      'Action-oriented, benefit-led, CTA-heavy tone. Emphasize numbers and time-bound offers. Persuasive but not pushy.',
  },
};

export const tonePresetIds = Object.keys(tones);

export function resolveTone(id) {
  return tones[id] ?? tones.friendly;
}
