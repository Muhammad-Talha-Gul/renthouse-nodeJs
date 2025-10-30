import React from "react";
import { Route, Routes } from "react-router-dom";
import Index from "../pages/Index/Index";
import PropertyDetails from "../components/PropertDetails/PropertyDetails"; // Corrected: "PropertyDetails" (not "PropertDetails")

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
        </Routes>
    );
}

export default AppRoutes;