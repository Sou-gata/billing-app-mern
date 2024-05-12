import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
    return (
        <div className="bg-gray-50 min-h-[100vh]">
            <Header />
            <div className="flex justify-center">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
