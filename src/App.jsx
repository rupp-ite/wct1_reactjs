// src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./lib/firebaseClient";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  
  // Set default to true so it's open on desktop initially, but fully toggleable!
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setCheckingSession(false);
      // Auto-close or open based on login status
      setIsSidebarOpen(!!currentUser);
    });
    return () => unsubscribe();
  }, []);

  async function handleLogout() {
    try {
      await signOut(auth);
      setIsSidebarOpen(false);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 animate-pulse font-medium">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Top Header Control Banner */}
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      <div className="flex flex-1 pt-16 relative">
        {/* Left Off-Canvas Sidebar Panels */}
        {user && (
          <Sidebar 
            user={user} 
            isOpen={isSidebarOpen} 
            setIsOpen={setIsSidebarOpen} 
          />
        )}

        {/* Dynamic Content Viewport - Padding shifts based on sidebar toggle status */}
        <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ${user && isSidebarOpen ? 'md:pl-64' : 'md:pl-0'}`}>
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route 
              path="/login" 
              element={!user ? <LoginPage /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/register" 
              element={!user ? <RegisterPage /> : <Navigate to="/" replace />} 
            />
          </Routes>
        </main>
      </div>

      {/* Footer adjustments to match current layout space */}
      <div className={`transition-all duration-300 ${user && isSidebarOpen ? 'md:pl-64' : 'md:pl-0'}`}>
        <Footer />
      </div>
    </div>
  );
}