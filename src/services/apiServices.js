import React from "react";
import axiosInstance from "../config/axiosInstance";

const apiServices = async (endpoint, method = "get", data = null, params = {}) => {
    try {
        const response = await axiosInstance({
            url: endpoint,
            method,
            data,
            headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
            params
        });
        if (response.data.status_code == 204) {
            alert("Access Denied", response.data.message, "error")
        }
        return response.data;
    } catch (error) {
        throw error?.response?.data || { message: "An unexpected error occurred" };
    }
}

export default apiServices;