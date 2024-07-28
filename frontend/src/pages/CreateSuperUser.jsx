import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message, Input, Button } from "antd";
import { baseUserUrl } from "../utils";

const CreateSuperUser = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: "", mobile: "" });
    useEffect(() => {
        const createSuperUser = async () => {
            try {
                const { data } = await axios.get(`${baseUserUrl}/super-user-number`);
                if (data.success) {
                    if (data.data.number > 0) {
                        message.error("Super user already exists");
                        navigate("/");
                        return;
                    }
                }
            } catch (error) {
                navigate("/");
            }
        };
        createSuperUser();
    }, []);

    const createSuperUser = async () => {
        try {
            const { data } = await axios.post(`${baseUserUrl}/create-super-user`, user);
            if (data.success) {
                message.success("Super user created successfully");
                navigate("/");
            } else {
                message.error(data.message || "Super user creation failed");
            }
        } catch (error) {
            message.error(error.response?.data?.message || "Super user creation failed");
        }
    };

    return (
        <div className="flex flex-col gap-5 p-5 mt-5 rounded-lg border border-gray-400">
            <h1 className="font-bold text-3xl text-center text-gray-800">Create Super User</h1>
            <table>
                <tr>
                    <td className="p-2">
                        <p className="font-bold">Name</p>
                    </td>
                    <td className="p-2">
                        <Input
                            placeholder="name"
                            value={user.name}
                            onChange={(e) => {
                                setUser((prev) => {
                                    return { ...prev, name: e.target.value };
                                });
                            }}
                        />
                    </td>
                </tr>
                <tr>
                    <td className="p-2">
                        <p className="font-bold">Mobile</p>
                    </td>
                    <td className="p-2">
                        <Input
                            placeholder="mobile"
                            value={user.mobile}
                            type="number"
                            onChange={(e) => {
                                setUser((prev) => {
                                    return { ...prev, mobile: e.target.value };
                                });
                            }}
                        />
                    </td>
                </tr>
            </table>
            <div className="w-full flex items-center justify-center">
                <Button type="primary" className="self-center" onClick={createSuperUser}>
                    Create
                </Button>
            </div>
            <div className="text-xs text-gray-400">
                <p>Note:</p>
                <p>1. Create accout</p>
                <p>2. Login (default password is 12345678)</p>
                <p>3. Change password</p>
            </div>
        </div>
    );
};

export default CreateSuperUser;
