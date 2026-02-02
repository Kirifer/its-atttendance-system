import API from "./api";

export const timeIn = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.post(
      "/attendance/time-in",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    let message = "Error timing in";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};

export const lunchOut = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.post(
      "/attendance/lunch-out",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    let message = "Error lunching out";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};

export const lunchIn = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.post(
      "/attendance/lunch-in",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    let message = "Error lunching in";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};

export const breakOut = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.post(
      "/attendance/break-out",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    let message = "Error breaking out";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};

export const breakIn = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.post(
      "/attendance/break-in",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    let message = "Error breaking in";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};

export const timeOut = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.post(
      "/attendance/time-out",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    let message = "Error timing out";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};

export const getUserAttendance = async (userId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get(`/attendance/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    let message = "Error fetching attendance";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};

export const getAllAttendance = async () => {
  const token = localStorage.getItem("token");

  const res = await API.get("/attendance", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const updateAttendance = async (id, data) => {
  const token = localStorage.getItem("token");

  const res = await API.put(`/attendance/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
