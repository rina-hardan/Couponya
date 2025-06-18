import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/",
  headers: {
    "Content-Type": "application/json"
  }
});

export async function fetchFromServer(endpoint, method = "GET", body = null) {
  try {
    const config = {
      url: endpoint,
      method,
    }
    if (body) {
      config.data = body;
    }

    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    console.error("Axios error:", error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}