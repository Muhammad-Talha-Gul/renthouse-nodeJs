import React from "react";
import { Route, Routes } from "react-router-dom";
// Lazy imports
const Index = lazy(() => import("../pages/Index/Index"));
const PropertyDetails = lazy(() => import("../components/PropertDetails/PropertyDetails"));
const Agents = lazy(() => import("../pages/Agents/Agents"));
const ContactUs = lazy(() => import("../pages/ContactUs/ContactUs"));
const AboutUs = lazy(() => import("../pages/AboutUs/AboutUs"));
const SearchPage = lazy(() => import("../pages/SearchProperties/SearchPage"));
const AdminPanel = lazy(() => import("../pages/Admin/AdminPanel/AdminPanel"));
const Login = lazy(() => import("../pages/Auth/Login"));
const Register = lazy(() => import("../pages/Auth/Register"));
const Dashboard = lazy(() => import("../pages/Admin/Dashboard/Dashboard"));
const CategoryManagement = lazy(() => import("../pages/Admin/CategoryManagement/CategoryManagement"));
const UserManagement = lazy(() => import("../pages/Admin/UserManagement/UserManagement"));
const PropertyManagement = lazy(() => import("../pages/Admin/PropertyManagement/PropertyManagement"));

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