export const CDN_URL = `https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/`;

export const GET_RESTAURANTS_URL =
  "https://swiggyapiwrapper.dineshrout.repl.co/api/restaurants";

export const BE_URL = "http://localhost:5500/api";

export function isURL(str) {
  const urlRegex = /^(?:https?:\/\/)?(?:www\.)?[\w\-\.\+]+\.\w+(?:\/.*)?$/;
  return urlRegex.test(str);
}
