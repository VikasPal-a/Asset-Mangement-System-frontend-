export const env = {
  API_BASE_URL:
    //import.meta.env.VITE_API_BASE_URL || "http://192.168.1.16:5000/api",
    import.meta.env.VITE_API_BASE_URL || "https://assetapi.unios.in/api",
  ENABLE_MOCK_FALLBACK: import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== "false",
};

export default env;
