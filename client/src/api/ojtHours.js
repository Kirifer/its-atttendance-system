import API from "./api";

// Get user OJT data
export const getUserOjtHours = async (userId) => {
  const res = await API.get(`/admins/ojt/${userId}`);
  return res.data;
};

// Set / Update total OJT hours
export const setUserOjtHours = async (userId, totalOJTHours) => {
  const res = await API.put(`/admins/ojt/${userId}`, {
    totalOJTHours,
  });
  return res.data;
};
