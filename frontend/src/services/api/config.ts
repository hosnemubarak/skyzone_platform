const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      let errorMessage = 'An error occurred while fetching the data.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData) || errorMessage;
      } catch (e) {
        // Fallback to text or default message if JSON parsing fails
      }
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Fetch Error [${endpoint}]:`, error);
    throw error;
  }
};
