import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { baseProductsUrl, formatDateTime } from "../utils";

const Product = () => {
    const { id } = useParams();

    let { search } = useLocation();
    const query = new URLSearchParams(search);
    search = query.get("search");

    const [selected, setSelected] = useState({});
    useEffect(() => {
        (async () => {
            const temp = await axios.get(`${baseProductsUrl}/${id}`, { withCredentials: true });
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
            <table className="min-w-[45vw]">
                <tbody>
                    {Object.keys(selected).map((key, i) => {
                        if (key != "_id" && key != "__v") {
                            return (
                                <tr key={i} className="uppercase mt-2 border border-black">
                                    <td className="font-bold px-2 py-1 w-1/4">
                                        {key == "value"
                                            ? "item"
                                            : key == "updatedBy"
                                            ? "updated by"
                                            : key == "createdBy"
                                            ? "created by"
                                            : key == "createdAt"
                                            ? "created at"
                                            : key == "updatedAt"
                                            ? "updated at"
                                            : key}
                                    </td>
                                    <td className="px-2 py-1 border-l border-black w-3/4">
                                        {key == "createdBy" || key == "updatedBy"
                                            ? selected[key].name
                                            : key == "createdAt" || key == "updatedAt"
                                            ? formatDateTime(selected[key])
                                            : selected[key]}
                                    </td>
                                </tr>
                            );
                        } else return null;
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Product;
