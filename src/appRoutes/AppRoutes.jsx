import React from "react";
import { Route, Routes } from "react-router-dom";
import Index from "../pages/Index/Index";
import PropertyDetails from "../components/PropertDetails/PropertyDetails"; // Corrected: "PropertyDetails" (not "PropertDetails")
import Agents from "../pages/Agents/Agents.Jsx";
import ContactUs from "../pages/ContactUs/ContactUs";
import AboutUs from "../pages/AboutUs/AboutUs";
import SearchPage from "../pages/SearchProperties/SearchPage";
import AdminPanel from "../pages/Admin/AdminPanel/AdminPanel";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/contact_us" element={<ContactUs />} />
            <Route path="/about_us" element={<AboutUs />} />
            <Route path="/search" element={<SearchPage />} />

            {/* Admin Side Route */}
            <Route path="/admin" element={<AdminPanel />} />
        </Routes>
    );
}

export default AppRoutes;