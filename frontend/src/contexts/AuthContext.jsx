import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authService } from "../services/authService";
// import jwt_decode from 'jwt-decode'; // Optional: for decoding token to get user info directly

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  // Token state is primarily managed by localStorage and apiClient interceptor for requests.
  // We might not need a separate token state here if currentUser implies token presence.
  // const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Default to not authenticated

  const fetchAndSetUser = useCallback(async () => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      try {
        // apiClient interceptor will add the token to the header
        const userData = await authService.getMyProfile();
        setCurrentUser(userData); // userData should be { _id, username, role }
        setIsAuthenticated(true);
      } catch (error) {
        // This likely means the token is invalid or expired
        console.error("Failed to fetch user profile with stored token:", error);
        localStorage.removeItem("authToken");
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setCurrentUser(null); // Explicitly set to null if no token
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAndSetUser();
  }, [fetchAndSetUser]);

  const login = async (username, password) => {
    try {
      const data = await authService.login({ username, password }); // authService.login already sets authToken in localStorage
      if (data && data.token) {
        // After successful login, backend returns user info. Use it directly.
        setCurrentUser({
          id: data._id, // Ensure backend sends _id as id or map it
          username: data.username,
          role: data.role,
        });
        // setToken(data.token); // Token is in localStorage, apiClient uses it.
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error("AuthContext login error:", error);
      localStorage.removeItem("authToken");
      setCurrentUser(null);
      // setToken(null);
      setIsAuthenticated(false);
      throw error;
    }
    return false;
  };

  const logout = () => {
    authService.logout(); // Clears localStorage
    setCurrentUser(null);
    // setToken(null);
    // Redirect logic can be handled in the component calling logout or via a navigate call here if router is accessible
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    // token, // Not strictly needed if isAuthenticated and currentUser are primary checks
    isAuthenticated,
    isLoading,
    login,
    logout,
    setIsAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
