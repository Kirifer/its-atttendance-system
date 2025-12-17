import API from "./api";

export const getAllUsers = async () => {
  const res = await API.get("/admins/all-users");
  return res.data.users;
};

export const updateUserInfo = async (userId, payload) => {
  const res = await API.put(`/admins/update-user-info/${userId}`, payload);
  return res.data;
};
