import { useState, useEffect } from "react";
import Login from "./components/Login";
import Board from "./components/Board";
import { api } from "./lib/api";

import NotificationListener from "./components/NotificationListener";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("home"); // home, about, changelog

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await api.auth.me();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-background text-foreground">Loading...</div>;

  if (user) {
    return (
      <>
        <NotificationListener user={user} />
        <Board user={user} onLogout={handleLogout} />
      </>
    );
  }

  return (
    <Login
      onLogin={handleLogin}
      currentView={currentView}
      setCurrentView={setCurrentView}
    />
  );
}

export default App;
