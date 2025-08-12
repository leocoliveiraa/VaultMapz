import { useAuth as useAuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
  return useAuthContext();
};

export const useRequireAuth = () => {
  const { currentUser, loading } = useAuthContext();

  return {
    user: currentUser,
    isAuthenticated: !!currentUser,
    loading,
  };
};
