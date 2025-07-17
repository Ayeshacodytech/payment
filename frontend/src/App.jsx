import { BrowserRouter, Navigate, Route, Routes, } from "react-router-dom"

//import { AuthContext } from "./authentications/authContext"
import { AuthProvider } from "./authentications/AuthContext"
import { ProtectedRoute } from "./authentications/ProtectedRoute"
import { Dashboard } from "./pages/Dashboard"
import { SendMoney } from "./pages/SendMoney"
import { Signin } from "./pages/Signin"
import { Signup } from "./pages/Signup"

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route
              path="/dashboard"
              element={
                  <Dashboard />
              }
            />
            
            <Route
              path="/sendmoney"
              element={
                <ProtectedRoute>
                  <SendMoney />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
    
  
}

export default App
