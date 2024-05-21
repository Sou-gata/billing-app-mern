import { useState } from "react";
import { Input, Space, message } from "antd";
import axios from "axios";
import { baseProductsUrl } from "../utils";

const AddSingleProduct = () => {
    const emptyProduct = {
        value: "",
        unit: "",
        cp: "",
        gst: "",
        sku: "",
    };
    const [product, setProduct] = useState({ ...emptyProduct });
    const handleAddData = async () => {
        try {
            let keys = Object.keys(product);
            let productData = {};
            for (let key of keys) {
                productData[key] = product[key].trim().toUpperCase();
            }
            const res = await axios.post(baseProductsUrl + "/add", productData);
            if (res.data.success) {
                setProduct({ ...emptyProduct });
                message.success("Product added successfully");
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
            <div className="flex items-center justify-center">
                <div>
                    <button
                        onClick={handleAddData}
                        className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md px-3"
                    >
                        Add Product
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSingleProduct;
