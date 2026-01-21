import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getTokenFromStorage = () => {
  const userData = localStorage.getItem("userData");
  if (userData) {
    const parsedData = JSON.parse(userData);
    return parsedData?.token || null; // ✅ Now correctly retrieves token
  }
  return null;
};


export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}`,
    prepareHeaders: (headers, { url }) => {
      const token = getTokenFromStorage();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // ✅ Set token dynamically
        if (url === "/clients/client-avatar") {
          headers.set("Content-Type", "multipart/form-data");
          // headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("Authorization", `Bearer ${token}`); // Set token dynamically

        // headers.set('ngrok-skip-browser-warning', '69420');

      }
      return headers;
    },
  }),
  endpoints: () => ({}), // Placeholder for endpoints
});

export default api;
