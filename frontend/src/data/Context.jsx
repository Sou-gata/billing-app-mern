import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { baseProductsUrl } from "../utils";

const Context = createContext();

const ContextProvider = ({ children }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        (async () => {
            const temp = await axios.get(baseProductsUrl + "/all");
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
