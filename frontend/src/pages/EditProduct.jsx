import { useContext, useEffect, useState } from "react";
import { Input, Space, message } from "antd";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Context } from "../data/Context";

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
        amount: "",
        location: "",
        entry: "",
        group: "",
        specification: "",
        hsn: "",
        sku: "",
        brand: "",
        category: "",
        id: "",
    };
    useEffect(() => {
        (async () => {
            if (id) {
                let temp = await axios.get(`http://localhost:7684/api/v1/products/${id}`);
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
            const res = await axios.put(
                "http://localhost:7684/api/v1/products/update/" + id,
                productData
            );
            if (res.data.success) {
                setProduct({ ...emptyProduct });
                message.success("Product added successfully");
                let temp = await axios.get("http://localhost:7684/api/v1/products/all");
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
                        placeholder="CP"
                        addonBefore="Cost Price"
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
                        placeholder="Quentity"
                        addonBefore="Quentity"
                        type="number"
                        value={product.quantity}
                        onChange={(e) => {
                            setProduct((prev) => {
                                return { ...prev, quantity: e.target.value };
                            });
                        }}
                    />
                </Space.Compact>
                <Space.Compact className="w-[45vw]">
                    <Input
                        placeholder="Amount"
                        addonBefore="Amount"
                        type="number"
                        value={product.amount}
                        onChange={(e) => {
                            setProduct((prev) => {
                                return { ...prev, amount: e.target.value };
                            });
                        }}
                    />
                </Space.Compact>
            </div>
            <div className="flex justify-between mt-4">
                <Space.Compact className="w-[45vw]">
                    <Input
                        placeholder="Room"
                        addonBefore="Room"
                        type="number"
                        value={product.location}
                        onChange={(e) => {
                            setProduct((prev) => {
                                return { ...prev, location: e.target.value };
                            });
                        }}
                    />
                </Space.Compact>
                <Space.Compact className="w-[45vw]">
                    <Input
                        placeholder="Entry by"
                        addonBefore="Entry by"
                        type="text"
                        value={product.entry}
                        onChange={(e) => {
                            setProduct((prev) => {
                                return { ...prev, entry: e.target.value };
                            });
                        }}
                    />
                </Space.Compact>
            </div>
            <div className="flex justify-between mt-4">
                <Space.Compact className="w-[45vw]">
                    <Input
                        placeholder="Group"
                        addonBefore="Group"
                        type="text"
                        value={product.group}
                        onChange={(e) => {
                            setProduct((prev) => {
                                return { ...prev, group: e.target.value };
                            });
                        }}
                    />
                </Space.Compact>
                <Space.Compact className="w-[45vw]">
                    <Input
                        placeholder="Specification"
                        addonBefore="Specification"
                        type="text"
                        value={product.specification}
                        onChange={(e) => {
                            setProduct((prev) => {
                                return { ...prev, specification: e.target.value };
                            });
                        }}
                    />
                </Space.Compact>
            </div>
            <div className="flex justify-between mt-4">
                <Space.Compact className="w-[45vw]">
                    <Input
                        placeholder="HSN"
                        addonBefore="HSN"
                        type="number"
                        value={product.hsn}
                        onChange={(e) => {
                            setProduct((prev) => {
                                return { ...prev, hsn: e.target.value };
                            });
                        }}
                    />
                </Space.Compact>
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
            <div className="flex justify-between mt-4">
                <Space.Compact className="w-[45vw]">
                    <Input
                        placeholder="Brand"
                        addonBefore="Brand"
                        type="text"
                        value={product.brand}
                        onChange={(e) => {
                            setProduct((prev) => {
                                return { ...prev, brand: e.target.value };
                            });
                        }}
                    />
                </Space.Compact>
                <Space.Compact className="w-[45vw]">
                    <Input
                        placeholder="Category"
                        addonBefore="Category"
                        type="text"
                        value={product.category}
                        onChange={(e) => {
                            setProduct((prev) => {
                                return { ...prev, category: e.target.value };
                            });
                        }}
                    />
                </Space.Compact>
            </div>
            <div className="flex justify-between mt-4">
                <Space.Compact className="w-[45vw]">
                    <Input
                        placeholder="Product ID"
                        addonBefore="Product ID"
                        type="text"
                        value={product.id}
                        onChange={(e) => {
                            setProduct((prev) => {
                                return { ...prev, id: e.target.value };
                            });
                        }}
                    />
                </Space.Compact>
            </div>
            <div className="flex items-center justify-center">
                <div>
                    <button
                        onClick={handleAddData}
                        className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md px-3"
                    >
                        Update Product
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
