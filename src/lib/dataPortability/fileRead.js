export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (file.text) {
      file.text().then(resolve).catch(reject);
      return;
    }

    // Fallback for older browsers
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

export const readJsonFile = async (file) => {
  try {
    const text = await readFileAsText(file);
    if (!text || !text.trim()) {
      throw new Error('File is empty');
    }
    
    const json = JSON.parse(text);
    return json;
  } catch (err) {
    throw new Error('Invalid JSON format: ' + err.message);
  }
};
