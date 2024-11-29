type ENVType = "dev" | "prod";

export const ENV: ENVType = "prod";

const ORIGINS: Record<ENVType, string> = {
  dev: "http://localhost:5000", // The origin of the server
  prod: document.location.origin,
};

export const BASE_URL = ORIGINS[ENV];
