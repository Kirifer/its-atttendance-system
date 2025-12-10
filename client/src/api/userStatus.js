import API from "./api";

export const getLoginStatus = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get("/attendance/attendance-status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data; 
  } catch (err) {
    let message = "Error fetching user status";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};
