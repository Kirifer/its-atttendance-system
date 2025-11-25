import API from "./api";

export const createLeave = async ({
  startDate,
  endDate,
  leaveType,
  reason,
}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await API.post(
      "/leave",
      { startDate, endDate, leaveType, reason },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (err) {
    let message = "Error creating leave";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};
