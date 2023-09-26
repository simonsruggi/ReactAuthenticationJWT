import React, { useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom'; 

const Logout = () => {
  const { setToken } = useContext(AuthContext); 
  const navigate = useNavigate();

  useEffect(() => {
    
    setToken(null);
    
    // Remove the token from local storage
    localStorage.removeItem('token');
    
    
    navigate('/login');
  }, []); 

  return (
    <div>Logging out...</div>
  );
};

export default Logout;
