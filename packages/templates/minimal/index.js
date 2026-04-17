import { schema } from "./schema.js";
import Site from "./Site.jsx";

/**
 * Minimal Template Configuration
 * * Энэхүү загвар нь "Less is more" зарчим дээр суурилсан.
 * Serif (Fraunces) болон Sans-serif (Inter) фонтын хослол нь
 * вэбсайтыг илүү editorial, luxury мэдрэмжтэй болгоно.
 */

export default {
  id: "minimal",
  name: {
    mn: "Минимал",
    en: "Minimal",
  },
  description: {
    mn: "Цэвэрхэн, агаарлаг, ямар ч салбарт тохирох орчин үеийн уянгалаг загвар.",
    en: "Clean, airy, and versatile design with a modern editorial touch.",
  },
  preview: "/templates/minimal.svg",
  industries: ["all", "portfolio", "architecture", "creative-agency"],
  tags: ["clean", "serif", "high-end", "editorial"],

  // Загварын үндсэн тохиргоонууд
  defaultTheme: {
    // Colors
    primary: "#0f0e0b", // Үндсэн хар (текст)
    accent: "#d14e22", // Тодотгол өнгө (улбар шар-хүрэн)
    background: "#faf8f2", // Бага зэрэг шаргал туяатай цагаан (Warm white)
    foreground: "#1a1915", // Туслах текст
    surface: "#ffffff", // Картуудын өнгө

    // UI Деталь
    border: "rgba(15, 14, 11, 0.08)",
    radius: "12px", // lg-г илүү тодорхой болгов

    // Typography (Next.js font system-д холбоход хялбар)
    fonts: {
      heading: "Fraunces",
      body: "Inter",
      mono: "JetBrains Mono", // Код эсвэл дата-д зориулсан
    },

    // Layout & Spacing
    config: {
      containerWidth: "1200px",
      sectionPadding: "clamp(4rem, 10vw, 8rem)",
      navStyle: "transparent", // 'glass', 'solid', 'transparent'
      buttonWeight: "600",
    },
  },

  // Өөр өнгөний сонголтууд (Preset Palettes)
  // Хэрэглэгч нэг товшоод л солих боломжтой
  palettes: [
    {
      name: "Onyx",
      primary: "#ffffff",
      background: "#0f0f0f",
      accent: "#3b82f6",
    },
    {
      name: "Forest",
      primary: "#1a2f23",
      background: "#f3f6f4",
      accent: "#2d6a4f",
    },
  ],

  schema,
  component: Site,
};
