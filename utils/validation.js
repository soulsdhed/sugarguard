function isValidDate(dateString) {
    if (dateString == null) return false; // Check for null or undefined
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return (
        date.getFullYear() === year &&
        date.getMonth() + 1 === month &&
        date.getDate() === day
    );
}

function isValidWeek(dateString) {
    if (dateString == null) return false; // Check for null or undefined
    const regex = /^\d{4}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const [year, week] = dateString.split("-").map(Number);
    return year > 0 && week >= 1 && week <= 53;
}

function isValidMonth(dateString) {
    if (dateString == null) return false; // Check for null or undefined
    const regex = /^\d{4}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const [year, month] = dateString.split("-").map(Number);
    return year > 0 && month >= 1 && month <= 12;
}

function isValidURL(url) {
    const urlPattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
            "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.?)+[a-zA-Z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?" + // port
            "(\\/[-a-zA-Z\\d%@_.~+&:]*)*" + // path
            "(\\?[;&a-zA-Z\\d%@_.,~+&:=-]*)?" + // query string
            "(\\#[-a-zA-Z\\d_]*)?$",
        "i" // fragment locator
    );

    return !!urlPattern.test(url);
}

module.exports = {
    isValidDate,
    isValidWeek,
    isValidMonth,
    isValidURL,
};
