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
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import CategoryManagement from "../pages/Admin/CategoryManagement/CategoryManagement";

export const adminRoutes = [
    { path: "dashboard", component: <Dashboard />, title: "Dashboard", icon: "📊" },
    { path: "categories", component: <CategoryManagement />, title: "Categories", icon: "🏷️" },
    // Add more admin routes here
];
function AppRoutes() {
    const token = localStorage.getItem("token"); // Check if user is logged in
    console.log("token console", token);
    return (
        <>
            {!token && <Header />}
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/contact_us" element={<ContactUs />} />
                <Route path="/about_us" element={<AboutUs />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />



                <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} />}>
                    <Route index element={<Dashboard />} />
                    {adminRoutes.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={route.component}
                        />
                    ))}
                </Route>
            </Routes>
            {!token && <Footer />}
        </>
    );
}

export default AppRoutes;