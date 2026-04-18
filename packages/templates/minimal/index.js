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
    primary: "#0f0e0b",
    accent: "#d14e22",
    background: "#faf8f2",
    foreground: "#1a1915",
    fontHeading: "Fraunces",
    fontBody: "Inter",
    radius: "lg",
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
