import API from "./api";

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
