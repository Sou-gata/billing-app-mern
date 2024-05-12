import { createContext, useEffect, useState } from "react";
import axios from "axios";

const Context = createContext();

const ContextProvider = ({ children }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        (async () => {
            const temp = await axios.get("http://localhost:7684/api/v1/products/all");
            let tempData = await temp.data;
            if (tempData.success) {
                setData(tempData.data);
            }
        })();
    }, []);
    return <Context.Provider value={{ data, setData }}>{children}</Context.Provider>;
};

export default ContextProvider;

export { Context };
