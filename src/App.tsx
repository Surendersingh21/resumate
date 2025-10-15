/**
 * Resumate - AI-Powered Resume Builder
 * 
 * PROPRIETARY SOFTWARE - ALL RIGHTS RESERVED
 * Copyright © 2025 Resumate. All Rights Reserved.
 * 
 * This software is proprietary and confidential.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * License required for use. Contact: licensing@resumate.com
 * Website: https://resumate.com/licensing
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CVProvider } from '@/context/CVContext';
import { AuthProvider } from '@/context/AuthContext';
import HomePage from '@/pages/HomePage';
import TemplatesPage from '@/pages/TemplatesPage';
import CVBuilderPage from '@/pages/CVBuilderPage';
import SignupPage from '@/pages/SignupPage';
import LoginPage from '@/pages/LoginPage';
import AboutPage from '@/pages/AboutPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { LicenseNotice } from '@/components/LicenseNotice';

function App() {
  return (
    <AuthProvider>
      <CVProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <div className="container mx-auto px-4 py-4">
                <LicenseNotice />
              </div>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/builder" element={<CVBuilderPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CVProvider>
    </AuthProvider>
  );
}

export default App;
