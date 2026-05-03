import { Navigate, Route, Routes} from "react-router";
import { lazy, Suspense, useEffect, useState } from "react";

// Lazy load page components for better performance
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const SignUpPage = lazy(() => import("./pages/SignUpPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage.jsx"));
const CallPage = lazy(() => import("./pages/CallPage.jsx"));
const ChatPage = lazy(() => import("./pages/ChatPage.jsx"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage.jsx"));

import { Toaster } from "react-hot-toast";

import PageLoader from "./components/PageLoader.jsx"
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./stores/useThemeStore.js";


const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();
  const [slowLoad, setSlowLoad] = useState(false);

  // After 4 s of loading tell the user the server is waking up (Render free
  // tier cold-start takes ~30-60 s). Resets automatically once loading finishes.
  useEffect(() => {
    if (!isLoading) { setSlowLoad(false); return; }
    const t = setTimeout(() => setSlowLoad(true), 4000);
    return () => clearTimeout(t);
  }, [isLoading]);

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return (
    <PageLoader
      message={slowLoad ? "Server is starting up, please wait (~30s on first visit)..." : "Loading..."}
    />
  );

  return(
     <div className="h-screen" data-theme = {theme}>
       <Suspense fallback={<PageLoader />}>
         <Routes>
           <Route 
             path="/"
             element ={
               isAuthenticated && isOnboarded ? (
                 <Layout showSidebar={true}>
                   <HomePage />
                 </Layout>
               ) : (
                 <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
               )
             }
           />
           <Route 
             path="/signup"
             element={
               !isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
             }
           />
           <Route 
             path="/login"
             element = {
              !isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
             }
           />
           <Route
             path="/notifications"
             element={
               isAuthenticated && isOnboarded ? (
                 <Layout showSidebar={true}>
                   <NotificationsPage />
                 </Layout>
               ): (
                 <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
               )
             }
           />
           <Route 
             path="/call/:id"
             element={
               isAuthenticated && isOnboarded ? (
                <CallPage />
               ) : (
                 <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
               )
             }
           />
           <Route 
             path="/chat/:id"
             element={
               isAuthenticated && isOnboarded ? (
                 <Layout showSidebar={false}>
                   <ChatPage />
                 </Layout>
               ) : (
                 <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
               )
             }
           />
           <Route
             path="/onboarding"
             element = {
               isAuthenticated ? (
                !isOnboarded ? (
                  <OnboardingPage />
                ) : (
                  <Navigate to="/" />
                )
               ): (
                <Navigate to="/login" />
               )
             }
           />
         </Routes>
       </Suspense>

       <Toaster />
     </div>
  )
}

export default App;