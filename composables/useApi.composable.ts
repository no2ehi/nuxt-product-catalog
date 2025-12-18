export const useApi = () => {
  const {
    public: { apiBase },
  } = useRuntimeConfig();

  if (!apiBase) {
    throw new Error("API base URL is not set");
  }

  return $fetch.create({
    baseURL: apiBase,
  });
};
