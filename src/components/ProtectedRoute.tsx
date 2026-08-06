import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import Loader from "./Loader";
import { getDefaultRouteForRole, routes } from "@/lib/routes";

const ProtectedRoute = ({
  children,
  allowRoles,
}: {
  children: React.ReactNode;
  allowRoles?: string[];
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader message="Checking your session…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to={routes.auth.login} replace state={{ from: location }} />;
  }

  if (allowRoles?.length) {
    const role = (user?.role || "").toUpperCase();
    if (!allowRoles.map((item) => item.toUpperCase()).includes(role)) {
      return <Navigate to={getDefaultRouteForRole(user?.role)} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
