let runtimeConfig: Awaited<ReturnType<typeof loadRuntimeConfig>>;

export const loadRuntimeConfig = async () => {
  const json = await getJSONConfig();
  const env = getEnvironmentVariables();

  const combined = {
    ...env,
    ...json,
  };

  if (!combined.VITE_PRIVY_APP_ID)
    throw new Error("VITE_PRIVY_APP_ID is required");
  if (!combined.VITE_ONEBALANCE_API_KEY)
    throw new Error("VITE_ONEBALANCE_API_KEY is required");
  if (!combined.VITE_ONEBALANCE_API)
    throw new Error("VITE_ONEBALANCE_API is required");

  runtimeConfig = combined;

  return combined;
};

export const getRuntimeConfig = () => runtimeConfig;

const getJSONConfig = () =>
  fetch(`${import.meta.env.BASE_URL}config.json`).then((response) => {
    if (!response.ok) throw response.json();
    return response.json();
  });

const getEnvironmentVariables = () => {
  return {
    VITE_PRIVY_APP_ID: import.meta.env.VITE_PRIVY_APP_ID,
    VITE_ONEBALANCE_API_KEY: import.meta.env.VITE_ONEBALANCE_API_KEY,
    VITE_ONEBALANCE_API: import.meta.env.VITE_ONEBALANCE_API,
  };
};
