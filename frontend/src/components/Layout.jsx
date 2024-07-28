import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import { baseUserUrl } from "../utils";
import { Context } from "../data/Context";

const Layout = () => {
    const { setUser } = useContext(Context);
    useEffect(() => {
        const verifyUser = async () => {
            let localUser = localStorage.getItem("user");
            if (localUser) {
                localUser = JSON.parse(localUser);
            } else {
                setUser(null);
                return;
            }
            try {
                const res = await axios.get(`${baseUserUrl}/verify`, { withCredentials: true });
                if (res.data.success) {
                    localStorage.setItem("user", JSON.stringify(res.data.data?.user));
                    setUser(res.data.data?.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                if (!error.response?.data?.success) {
                    setUser(null);
                }
            }
        };
        verifyUser();
    }, []);
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
