import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";

const Product = () => {
    const { id } = useParams();

    let { search } = useLocation();
    const query = new URLSearchParams(search);
    search = query.get("search");

    const [selected, setSelected] = useState({});
    useEffect(() => {
        (async () => {
            const temp = await axios.get(`http://localhost:7684/api/v1/products/${id}`);
            let tempData = await temp.data;
            if (tempData.success) {
                setSelected(tempData.data);
            }
        })();
    }, [id]);
    return (
        <div className="flex gap-3 mt-3 flex-col">
            <Link
                to={search ? `/all-products?search=${search}` : "/all-products"}
                className="bg-blue-500 text-center hover:bg-blue-700 text-white py-2 px-4 rounded-md m-0 my-4"
            >
                Back
            </Link>
            <table>
                {Object.keys(selected).map((key, i) => {
                    if (key != "_id" && key != "__v" && key != "createdAt" && key != "updatedAt")
                        return (
                            <tr key={i} className="uppercase mt-2 border border-black">
                                <td className="font-bold px-2 py-1">
                                    {key == "value" ? "item" : key}
                                </td>
                                <td className="px-2 py-1 border-l border-black">{selected[key]}</td>
                            </tr>
                        );
                    else return null;
                })}
            </table>
        </div>
    );
};

export default Product;
