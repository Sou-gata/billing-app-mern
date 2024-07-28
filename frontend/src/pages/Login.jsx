import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "antd";
import { Context } from "../data/Context";
import { baseUserUrl } from "../utils";

const Login = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(Context);
    const [details, setDetails] = useState({
        mobile: "",
        password: "",
    });
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user]);
    const handleLogin = async () => {
        try {
            const res = await axios.post(`${baseUserUrl}/login`, details, {
                withCredentials: true,
            });
            if (res.data.success) {
                setUser(res.data.data?.user);
                localStorage.setItem("user", JSON.stringify(res.data.data?.user));
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="w-full h-[80vh] flex items-center justify-center">
            <div className="flex flex-col gap-5 w-[400px] border p-5 rounded-lg border-black">
                <h1 className="text-3xl text-center font-bold text-gray-700">Login</h1>
                <Input
                    placeholder="Mobile number"
                    type="number"
                    value={details.mobile}
                    onChange={(e) => {
                        setDetails({ ...details, mobile: e.target.value });
                    }}
                />
                <Input.Password
                    placeholder="Password"
                    value={details.password}
                    onChange={(e) => {
                        setDetails({ ...details, password: e.target.value });
                    }}
                />
                <Button type="primary" onClick={handleLogin} className="w-full">
                    Login
                </Button>
            </div>
        </div>
    );
};

export default Login;
