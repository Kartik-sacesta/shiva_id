import axios from "axios";
import { setLoading } from "../../redux/features/Loading/LoadingSlice";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
let activeRequestsCount = 0;
const customAxiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, body, params }, api) => {
    try {
      if (activeRequestsCount === 0) {
        api.dispatch(setLoading(true));
      }
      activeRequestsCount++;

      const token = localStorage.getItem("accessToken");
      const response = await axios({
        url: baseUrl + url,
        method,
        data: body,
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return { data: response.data };
    } catch (error) {
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message,
        },
      };
    } finally {
      activeRequestsCount--;
      if (activeRequestsCount === 0) {
        api.dispatch(setLoading(false));
      }
    }
  };

export default customAxiosBaseQuery({ baseUrl: BASE_URL });
