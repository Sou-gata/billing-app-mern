import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input, Button, message } from "antd";
import { baseUserUrl } from "../utils";
import { Context } from "../data/Context";

const ChangePassword = () => {
    const navigate = useNavigate();
    const { user } = useContext(Context);
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user]);
    const [details, setDetails] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const handlePasswordChange = async () => {
        if (details.newPassword !== details.confirmPassword) {
            message.error("Passwords do not match");
            return;
        } else if (!details.oldPassword) {
            message.error("Please enter old password");
            return;
        } else if (!details.newPassword) {
            message.error("Please enter new password");
            return;
        } else if (!details.confirmPassword) {
            message.error("Please enter confirm password");
            return;
        } else if (details.newPassword.length < 8) {
            message.error("Password should be atleast 8 characters long");
            return;
        } else if (details.oldPassword === details.newPassword) {
            message.error("New password should be different from old password");
            return;
        }
        try {
            const res = await axios.post(`${baseUserUrl}/change-password`, details, {
                withCredentials: true,
            });
            if (res.data.success) {
                setDetails({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
                message.success("Password changed successfully");
            } else {
                message.error(res.data?.message);
            }
        } catch (error) {
            message.error(error.response?.data?.message || "Something went wrong");
        }
    };
    return (
        <div className="w-full h-[80vh] flex items-center justify-center">
            <div className="flex flex-col gap-5 w-[400px] border p-5 rounded-lg border-gray-400">
                <h1 className="text-3xl text-center font-bold text-gray-700">Change Password</h1>

                <Input.Password
                    placeholder="Current Password"
                    value={details.oldPassword}
                    onChange={(e) => {
                        setDetails({ ...details, oldPassword: e.target.value });
                    }}
                />
                <Input.Password
                    placeholder="New Password"
                    value={details.newPassword}
                    onChange={(e) => {
                        setDetails({ ...details, newPassword: e.target.value });
                    }}
                />
                <Input.Password
                    placeholder="Confirm Password"
                    value={details.confirmPassword}
                    onChange={(e) => {
                        setDetails({ ...details, confirmPassword: e.target.value });
                    }}
                />
                <Button type="primary" onClick={handlePasswordChange} className="w-full">
                    Change Password
                </Button>
            </div>
        </div>
    );
};

export default ChangePassword;
