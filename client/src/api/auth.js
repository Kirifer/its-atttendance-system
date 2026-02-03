import API from "./api";

// Sign up
export const signUpUser = async (
  username,
  email,
  password,
  confirmPassword
) => {
  try {
    const response = await API.post("/auth/sign-up", {
      username,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (err) {
    let message = "Error during sign-up";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};

// Login
export const loginUser = async (email, password) => {
  try {
    const response = await API.post("/auth/login", { email, password });
    return response.data;
  } catch (err) {
    let message = "Error during login";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};

// Forgot password
export const forgotPassword = async (email, reason = "initial") => {
  try {
    const response = await API.post("/auth/forgot-password", { email, reason });
    return response.data;
  } catch (err) {
    let message = "Error during password reset request";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};

// Reset password
export const resetPassword = async (token, newPassword, confirmNewPassword) => {
  try {
    const response = await API.post("/auth/reset-password", {
      token,
      newPassword,
      confirmNewPassword,
    });
    return response.data;
  } catch (err) {
    let message = "Error during password reset";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};

// Change password
export const changePassword = async (
  oldPassword,
  newPassword,
  confirmNewPassword
) => {
  try {
    const res = await API.post("/auth/change-password", {
      oldPassword,
      newPassword,
      confirmNewPassword,
    });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  } catch (err) {
    let message = "Error changing password";
    if (err.response?.data?.message) message = err.response.data.message;
    throw new Error(message);
  }
};

// Update user info (Username and email)
export const updateUserInfo = async (username, email) => {
  try {
    const response = await API.put("/auth/update", { username, email });
    return response.data;
  } catch (err) {
    let message = "Error updating user information";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};

// Get all non-admin users
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await API.get("/auth/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.users || [];
  } catch (err) {
    let message = "Error fetching users";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};

export const getAllStaffUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/admins/all-users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.users || [];
  } catch (err) {
    let message = "Error fetching users";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};

// Get all admin users
export const getAllAdminUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await API.get("/auth/admins", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.admins || [];
  } catch (err) {
    let message = "Error fetching admins";
    if (err.response?.data?.message) message = err.response.data.message;
    throw new Error(message);
  }
};

export const changeUserRole = async (userId, role) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.put(
      `/admins/change-role/${userId}`,
      { role },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to change role");
  }
};

export const getAllUsersWithRoles = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/admins/all-users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.users || [];
  } catch (err) {
    let message = "Error fetching all users";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};

// otp
export const verifyOtp = async (email, otp) => {
  const res = await API.post("/auth/verify-otp", { email, otp });
  return res.data;
};

export const getTimesheetMeta = async (userId) => {
  const res = await API.get(`/admins/timesheet-meta/${userId}`);
  return res.data;
};

