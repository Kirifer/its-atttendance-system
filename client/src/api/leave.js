import API from "./api";

export const createLeave = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await API.post("/leave", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", 
      },
    });

    return response.data;
  } catch (err) {
    let message = "Error creating leave";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};
