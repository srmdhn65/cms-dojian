const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://default-api.com";
const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL || "/";
const APP_MODE = import.meta.env.VITE_APP_MODE || "dev";

export default {
  API_BASE_URL,
  PUBLIC_URL,
  APP_MODE,
};
