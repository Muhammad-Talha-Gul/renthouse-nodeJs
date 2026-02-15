import React from "react";
import { Route, Routes } from "react-router-dom";
import Index from "../pages/Index/Index";
import PropertyDetails from "../components/PropertDetails/PropertyDetails"; // Corrected: "PropertyDetails" (not "PropertDetails")
import Agents from "../pages/Agents/Agents.Jsx";
import ContactUs from "../pages/ContactUs/ContactUs";
import AboutUs from "../pages/AboutUs/AboutUs";
import SearchPage from "../pages/SearchProperties/SearchPage";
import AdminPanel from "../pages/Admin/AdminPanel/AdminPanel";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import CategoryManagement from "../pages/Admin/CategoryManagement/CategoryManagement";
import PublicLayout from "./PublicLayout";
import UserManagement from "../pages/Admin/UserManagement/UserManagement";
import PropertyManagement from "../pages/Admin/PropertyManagement/PropertyManagement";

export const adminRoutes = [
    { path: "dashboard", component: <Dashboard />, title: "Dashboard", icon: "📊" },
    { path: "categories", component: <CategoryManagement />, title: "Categories", icon: "🏷️" },
    { path: "users", component: <UserManagement />, title: "Users", icon: "🏷️" },
    { path: "properties", component: <PropertyManagement />, title: "Properties", icon: "🏷️" },
    // Add more admin routes here
];
function AppRoutes() {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/contact_us" element={<ContactUs />} />
                <Route path="/about_us" element={<AboutUs />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected admin routes */}
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
    );
}

export default AppRoutes;