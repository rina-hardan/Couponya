import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/"
});

export async function fetchFromServer(endpoint, method = "GET", body = null) {
  try {
    const token = localStorage.getItem("token");

    const config = {
      url: endpoint,
      method: method, 
      headers: {
        ...(token && { Authorization: `${token}` })
      }
    };

    if (body) {
      config.data = body;

      if (!(body instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
      }
    }

    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    console.error("Axios error:", error);
  console.log("Axios error response:", error.message);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}
