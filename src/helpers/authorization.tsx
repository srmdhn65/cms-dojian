import { Navigate, Outlet } from 'react-router-dom';

const ProtectRoute = () => {
  const TOKEN = localStorage.getItem('token');

  if (!TOKEN) {
    return <Navigate to="/auth/signin" />;
  } else {
    return <Outlet />;
  }
};

export default ProtectRoute;
