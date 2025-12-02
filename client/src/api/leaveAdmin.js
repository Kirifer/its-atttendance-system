import API from "./api";

export const getAllLeaves = async () => {
  const token = localStorage.getItem("token");
  const res = await API.get("/leave", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getMyLeaves = async () => {
  const token = localStorage.getItem("token");
  const res = await API.get("/leave", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateLeaveStatus = async (id, status) => {
  const token = localStorage.getItem("token");
  const res = await API.patch(
    `/leave/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const deleteLeave = async (id) => {
  const token = localStorage.getItem("token");
  const res = await API.delete(`/leave/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
