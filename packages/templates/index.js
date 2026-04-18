import minimal from './minimal/index.js';
import business from './business/index.js';
import restaurant from './restaurant/index.js';
import portfolio from './portfolio/index.js';

// 19 new industry templates
import beauty_salon from './beauty_salon/index.js';
import fitness from './fitness/index.js';
import restaurant_mongolian from './restaurant_mongolian/index.js';
import crafts from './crafts/index.js';
import education from './education/index.js';
import clinic from './clinic/index.js';
import auto_repair from './auto_repair/index.js';
import fashion_store from './fashion_store/index.js';
import home_service from './home_service/index.js';
import sales_rep from './sales_rep/index.js';
import photography from './photography/index.js';
import travel from './travel/index.js';
import legal from './legal/index.js';
import furniture from './furniture/index.js';
import pet_shop from './pet_shop/index.js';
import gifts from './gifts/index.js';
import phone_repair from './phone_repair/index.js';
import music_school from './music_school/index.js';
import organic_food from './organic_food/index.js';

export const templates = {
  [minimal.id]: minimal,
  [business.id]: business,
  [restaurant.id]: restaurant,
  [portfolio.id]: portfolio,
  [beauty_salon.id]: beauty_salon,
  [fitness.id]: fitness,
  [restaurant_mongolian.id]: restaurant_mongolian,
  [crafts.id]: crafts,
  [education.id]: education,
  [clinic.id]: clinic,
  [auto_repair.id]: auto_repair,
  [fashion_store.id]: fashion_store,
  [home_service.id]: home_service,
  [sales_rep.id]: sales_rep,
  [photography.id]: photography,
  [travel.id]: travel,
  [legal.id]: legal,
  [furniture.id]: furniture,
  [pet_shop.id]: pet_shop,
  [gifts.id]: gifts,
  [phone_repair.id]: phone_repair,
  [music_school.id]: music_school,
  [organic_food.id]: organic_food,
};

export const templateList = Object.values(templates).map((t) => ({
  id: t.id,
  name: t.name,
  description: t.description,
  preview: t.preview,
  industries: t.industries,
  defaultTheme: t.defaultTheme,
}));

export function getTemplate(id) {
  return templates[id] ?? null;
}
