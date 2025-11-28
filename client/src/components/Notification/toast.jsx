import { toast, Bounce } from "react-toastify";

export const showToast = ({
  message,
  icon = "🔔",
  color = "#333",
  type = "default",
}) => {
  const validTypes = ["default", "success", "info", "warning", "error"];

  const toastType = validTypes.includes(type) ? type : "default";

  toast[toastType](message, {
    icon,
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    transition: Bounce,
    style: {
      backgroundColor: color,
      color: "black",
      padding: "14px 18px",
      borderRadius: "8px",
    },
    progressStyle: {
      background: "white",
    },
  });
};
