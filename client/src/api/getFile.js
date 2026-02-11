import API from "./api";

let urlCache = new Map();

export const getDocumentUrl = async (s3Key) => {
  if (!s3Key) {
    return "";
  }

  if (s3Key.startsWith("http://localhost") || s3Key.startsWith("http://127.0.0.1")) {
    return s3Key;
  }

  let key = s3Key;
  if (s3Key.startsWith("http://") || s3Key.startsWith("https://")) {
    try {
      const url = new URL(s3Key);
      key = decodeURIComponent(url.pathname.substring(1));
    } catch (error) {
      console.error("Failed to parse S3 URL:", error);
      return "";
    }
  }

  const cached = urlCache.get(key);
  if (cached && Date.now() - cached.timestamp < 55 * 60 * 1000) {
    return cached.url;
  }

  try {
    const response = await API.get(`/s3/url?key=${encodeURIComponent(key)}`);
    
    urlCache.set(key, {
      url: response.data.url,
      timestamp: Date.now(),
    });

    return response.data.url;
  } catch (error) {
    console.error("Error getting document URL:", error);
    return "";
  }
};

export const viewDocument = async (s3Key) => {
  const url = await getDocumentUrl(s3Key);
  if (url) {
    window.open(url, '_blank');
  }
};