import { toast } from "react-toastify";

/* ---------------- TOAST ONLY ---------------- */

export const showSuccessToast = (message) => {
  toast.success(message || "Success!", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showErrorToast = (message) => {
  toast.error(message || "Something went wrong!", {
    position: "top-right",
    autoClose: 3000,
  });
};

export const showInfoToast = (message) => {
  toast.info(message || "Information", {
    position: "top-right",
    autoClose: 3000,
  });
};
