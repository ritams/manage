
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import UserDetails from './pages/UserDetails';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/:id" element={<UserDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
