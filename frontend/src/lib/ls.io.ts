export const lsWrite = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const lsRead = <T>(key: string): T | undefined => {
  const j = localStorage.getItem(key);
  if (!j) return;
  const v = JSON.parse(j);
  return v as T;
};
