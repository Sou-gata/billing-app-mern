import { useContext, useEffect, useState } from "react";
import { Input, Space, message } from "antd";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Context } from "../data/Context";
import { baseProductsUrl } from "../utils";

const EditProduct = () => {
    const { setData } = useContext(Context);
    const { id } = useParams();
    const navigate = useNavigate();
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    search = query.get("search");
    const emptyProduct = {
        value: "",
        unit: "",
        cp: "",
        gst: "",
        quantity: "",
        sku: "",
    };
    useEffect(() => {
        (async () => {
            if (id) {
                let temp = await axios.get(`${baseProductsUrl}/${id}`);
                temp = temp.data;
                if (temp.success) {
                    setProduct(temp.data);
                } else {
                    message.error("Product not found");
                    setProduct({ ...emptyProduct });
                }
            }
        })();
    }, [id]);
    const [product, setProduct] = useState({ ...emptyProduct });
    const handleAddData = async () => {
        try {
            let keys = Object.keys(product);
            let productData = {};
            for (let key of keys) {
                productData[key] = product[key].toString().trim().toUpperCase();
            }
            const res = await axios.put(baseProductsUrl + "/update/" + id, productData);
            if (res.data.success) {
                setProduct({ ...emptyProduct });
                message.success("Product added successfully");
                let temp = await axios.get(baseProductsUrl + "/all");
                temp = temp.data;
                if (temp.success) {
                    setData(temp.data);
                }
                if (search) {
                    navigate("/all-products?search=" + search);
                } else {
                    navigate("/all-products");
                }
            }
        } catch (error) {
            message.error("Product adding failed");
        }
    };
    return (
        <div className="w-full p-4">
            <div className="flex justify-between">
                <Space.Compact className="w-[45vw]">
                    <Input
                        placeholder="Enter product name"
                        addonBefore="Product name"
                        value={product.value}
                        onChange={(e) => {
                            setProduct((prev) => {
                                return { ...prev, value: e.target.value };
                            });
                        }}
                    />
                </Space.Compact>
                <Space.Compact className="w-[45vw]">
                    <Input
                        placeholder="Unit"
                        addonBefore="Unit"
                        value={product.unit}
                        onChange={(e) => {
                            setProduct((prev) => {
                                return { ...prev, unit: e.target.value };
                            });
                        }}
                    />
                </Space.Compact>
            </div>
            <div className="flex justify-between mt-4">
                <Space.Compact className="w-[45vw]">
                    <Input
                        placeholder="Rate"
                        addonBefore="Rate"
                        type="number"
                        value={product.cp}
                        onChange={(e) => {
                            setProduct((prev) => {
                                return { ...prev, cp: e.target.value };
                            });
                        }}
                    />
                </Space.Compact>
                <Space.Compact className="w-[45vw]">
                    <Input
                        placeholder="GST %"
                        addonBefore="GST %"
                        type="number"
                        value={product.gst}
                        onChange={(e) => {
                            setProduct((prev) => {
                                return { ...prev, gst: e.target.value };
                            });
                        }}
                    />
                </Space.Compact>
            </div>
            <div className="flex justify-between mt-4">
                <Space.Compact className="w-[45vw]">
                    <Input
                        placeholder="SKU No"
                        addonBefore="SKU No"
                        type="text"
                        value={product.sku}
                        onChange={(e) => {
                            setProduct((prev) => {
                                return { ...prev, sku: e.target.value };
                            });
                        }}
                    />
                </Space.Compact>
            </div>
            <div className="flex items-center justify-center gap-8 mt-8">
                <div>
                    <button
                        onClick={handleAddData}
                        className="w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-md px-3"
                    >
                        Update Product
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => {
                            navigate("/all-products" + window.location.search);
                        }}
                        className="w-full mt-4 bg-red-500 hover:bg-red-700 text-white py-2 rounded-md px-3"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
