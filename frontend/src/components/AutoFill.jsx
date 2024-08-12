import React from "react";

export const AutoFill = ({ data, isVisible, setIsvisible, setPartyDetails }) => {
    const handleOnClick = (i) => {
        setIsvisible(false);
        setPartyDetails((prev) => {
            return {
                ...prev,
                mobile: data[i].mobile,
                name: data[i].name,
                address: data[i].address,
            };
        });
    };

    if (!isVisible || data.length == 0) return <></>;
    return (
        <div className="absolute top-9 bg-white w-1/2 border z-50 rounded-lg">
            {data.map((item, index) => {
                return (
                    <div
                        key={index}
                        className="cursor-pointer hover:bg-gray-100 p-3"
                        onClick={() => {
                            handleOnClick(index);
                        }}
                    >
                        <p>{item.mobile}</p>
                    </div>
                );
            })}
        </div>
    );
};
