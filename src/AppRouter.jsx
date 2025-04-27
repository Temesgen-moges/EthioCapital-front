import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './sign_up/SignUp';
import Login from './sign_up/Login';
import Welcome from './screen/Welcome';
import InvestorDashboard from './enterpreners/InvestorDashboard';
import StartupDetail from './enterpreners/StartupDetail';
import SubmitIdeaScreen from './invaster/SubmitideaScreen';
import EntrepreneurDashboard from './invaster/EntrepreneurDashboard';
import BlogPage from './All/BlogPage';
import BlogAdminForm from './Add/BlogAdminForm';
import AdminDashboard from './Add/AdminDashboard';
import InvestorProfile from './enterpreners/InvestorProfile';
import InvestorProfileForm from './enterpreners/InvestorProfileForm';
import EditIdeaPage from './invaster/EditIdeaPage';
import BoardDashboard from './bord/BoardDashboard';
import Documents from './bord/Documents';
import PaymentForm from './payment/PaymentForm';
import SuccessPage from './payment/SuccessPage';
import Chatbot from './Ai/Chatbot';
import StudentApplicationForm from './student/StudentApplicationForm';
import FundingTypeSelector from './student/FundingTypeSelector';
import StudentDetail from './student/StudentDetail';
import VideoCall from './All/VideoCall';
import SecureDocumentViewer from './enterpreners/SecureDocumentViewer';
import InvestorVerificationHandler from './Add/InvestorVerificationHandler'; // Add this import
import ResetPassword from './sign_up/ResetPassword';
import ForgotPassword from './sign_up/ForgotPassword';



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
        <Route path="/Investor-Profile" element={<InvestorProfile />} />
        <Route path="/Investor-profile-form" element={<InvestorProfileForm />} />
        <Route path="/edit-idea/:id" element={<EditIdeaPage />} />
        <Route path="/BoardDashboard" element={<BoardDashboard />} />
        <Route path="/Documents" element={<Documents />} />
        <Route path="/PaymentForm" element={<PaymentForm />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/Chatbot" element={<Chatbot />} />
        <Route path="/StudentApplicationForm" element={<StudentApplicationForm />} />
        <Route path="/FundingTypeSelector" element={<FundingTypeSelector />} />
        <Route path="/student-applications/:id" element={<StudentDetail />} />
        <Route path="/VideoCall" element={<VideoCall />} />
        <Route
          path="/view-document/:documentPath"
          element={<SecureDocumentViewer />}
        />
        <Route
          path="/investor-verification"
          element={<InvestorVerificationHandler />}
        /> {/* Add this route */}
        <Route path="*" element={<Welcome />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      
     
      </Routes>
    </Router>
  );
};

export default AppRouter;