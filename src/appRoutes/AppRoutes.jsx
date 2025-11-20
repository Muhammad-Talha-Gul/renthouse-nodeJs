import React from "react";
import { Route, Routes } from "react-router-dom";
import Index from "../pages/Index/Index";
import PropertyDetails from "../components/PropertDetails/PropertyDetails"; // Corrected: "PropertyDetails" (not "PropertDetails")
import Agents from "../pages/Agents/Agents.Jsx";
import ContactUs from "../pages/ContactUs/ContactUs";
import AboutUs from "../pages/AboutUs/AboutUs";
import SearchPage from "../pages/SearchProperties/SearchPage";
import AdminPanel from "../pages/Admin/AdminPanel/AdminPanel";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ProtectedRoute from "./ProtectedRoute";


function AppRoutes() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/contact_us" element={<ContactUs />} />
                <Route path="/about_us" element={<AboutUs />} />
                <Route path="/search" element={<SearchPage />} />
                {/* Protected Admin Route */}
                <Route
                    path="/admin"
                    element={<ProtectedRoute element={<AdminPanel />} />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
            <Footer />
        </>
    );
}

export default AppRoutes;