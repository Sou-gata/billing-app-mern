export const pad = (num) => {
    return (num < 10 ? "0" : "") + num;
};

export const formatDate = (date) => {
    const d = new Date(date);
    return pad(d?.getDate()) + "-" + pad(d?.getMonth() + 1) + "-" + d?.getFullYear();
};

export const formatTime = (date) => {
    const d = new Date(date);
    let h = d?.getHours();
    let m = d?.getMinutes();
    let miridian = "AM";
    if (h >= 12) miridian = "PM";
    h = h % 12;
    if (h === 0) h = 12;
    return pad(h) + ":" + pad(m) + " " + miridian;
};

export const parseRupee = (num) => {
    return parseFloat(num + "").toFixed(2);
};
