import { useContext } from "react";
import { Context } from "../data/Context";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
    const { user } = useContext(Context);
    if (user) {
        return children;
    } else {
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoutes;
