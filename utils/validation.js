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

module.exports = {
    isValidDate,
    isValidWeek,
    isValidMonth,
};
