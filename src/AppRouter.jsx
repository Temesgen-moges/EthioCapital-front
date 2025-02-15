import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./sign_up/SignUp";
import Login from "./sign_up/Login";
import Welcome from "./screen/Welcome";
import InvestorDashboard from "./enterpreners/InvestorDashboard"; 
import StartupDetail from "./enterpreners/StartupDetail";
import SubmitIdeaScreen from "./invaster/SubmitideaScreen";
import EntrepreneurDashboard from "./invaster/EntrepreneurDashboard";
import BlogPage from "./All/BlogPage";
import BlogAdminForm from "./Add/BlogAdminForm";
import AdminDashboard from "./Add/AdminDashboard";
import InvestorProfile from "./enterpreners/InvestorProfile";
import InvestorProfileForm from "./enterpreners/InvestorProfileForm";
import EditIdeaPage from "./invaster/EditIdeaPage";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/investor-dashboard" element={<InvestorDashboard />} />
        <Route path="/Startup-Detail/:id" element={<StartupDetail />} />
        <Route path="/Submit-Idea" element={<SubmitIdeaScreen />} />
        <Route path="/Entrepreneur-dashboard" element={<EntrepreneurDashboard />} />
        <Route path="/Blog-page" element={<BlogPage />} />
        <Route path="/Blog-admin-page" element={<BlogAdminForm />} />
        <Route path="/Admin-Dashboard" element={<AdminDashboard />} />
        {/* Corrected route path */}
        <Route path="/Investor-Profile" element={<InvestorProfile />} />
        <Route path="/Investor-profile-form" element={<InvestorProfileForm />} />
        <Route path="*" element={<Welcome />} />,
        <Route path="/edit-idea/:id" element={<EditIdeaPage />} />
      </Routes>
    </Router>  
  );
};
export default AppRouter;