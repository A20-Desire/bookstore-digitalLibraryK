import React from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/Authprovider";

function Logout() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <button
      className="btn btn-error btn-sm md:btn-md text-white"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}

export default Logout;
