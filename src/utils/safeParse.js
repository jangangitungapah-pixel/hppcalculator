export const safeParseJSON = (jsonString, fallback = null) => {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Failed to parse JSON string:', e);
    return fallback;
  }
};

export const safeStringifyJSON = (data, fallback = '') => {
  try {
    return JSON.stringify(data);
  } catch (e) {
    console.error('Failed to stringify JSON data:', e);
    return fallback;
  }
};
