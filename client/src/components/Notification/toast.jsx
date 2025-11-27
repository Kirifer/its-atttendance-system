import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = ({ message, icon, color }) => {
  toast(message, {
    icon: icon,
    style: {
      backgroundColor: color,
      color: "white",
      fontWeight: "bold",
      padding: "12px 16px",
    },
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    progressStyle: {
      background: "white",
    },
    closeOnClick: true,
    pauseOnHover: true,
  });
};
