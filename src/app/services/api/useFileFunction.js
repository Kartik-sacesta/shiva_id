import axios from "axios";

const useFileFunction = () => {
  const base_url = import.meta.env.VITE_BACKEND_URL;

  // Set up axios defaults
  axios.defaults.baseURL = base_url;
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("accessToken")}`;
  axios.defaults.headers.post["Content-Type"] = "multipart/form-data";

  const uploadFile = async (file) => {
    
    try {
      const fileType = getFileType(file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", fileType);

      const response = await axios.post("/file/upload", formData); // Replace with your backend endpoint

      return response.data?.data?.url;
    } catch (error) {
      throw new Error("An error occurred while uploading the file.");
    }
  };

  const deleteFile = async (fileName) => {
    try {
      if (typeof fileName === "string") {
        await axios.delete("/file/delete", { data: { fileName } }); // Replace with your backend endpoint
      }
    } catch (error) {
      throw new Error("An error occurred while deleting the file.");
    }
  };

  const getFileType = (file) => {
    const mimeType = file.type;

    if (mimeType.startsWith("image/")) {
      return "image";
    } else if (mimeType.startsWith("video/")) {
      return "video";
    } else {
      return mimeType;
    }
  };

  return { uploadFile, deleteFile };
};

export default useFileFunction;
