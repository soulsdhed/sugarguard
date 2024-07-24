function getDateOfISOWeek(w, y) {
    const simple = new Date(y, 0, 1 + (w - 1) * 7);
    const dow = simple.getDay();
    const ISOweekStart = simple;
    if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

function parseWeekString(weekString) {
    const [year, week] = weekString.split("-").map(Number);
    return { year, week };
}

function getWeekDateRange(startWeekString, endWeekString) {
    const { year: startYear, week: startWeek } =
        parseWeekString(startWeekString);
    const { year: endYear, week: endWeek } = parseWeekString(endWeekString);

    const startDate = getDateOfISOWeek(startWeek, startYear);
    const endDate = getDateOfISOWeek(endWeek, endYear);
    endDate.setDate(endDate.getDate() + 6); // Set end date to the end of the week

    return {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
    };
}

function getLastDateOfMonth(dateString) {
    const [year, month] = dateString.split("-").map(Number);

    // Get the last day of the month
    const lastDay = new Date(year, month, 0).getDate();

    // Create a date object for the last day of the month
    const lastDate = new Date(year, month - 1, lastDay);

    return lastDate.toISOString().split("T")[0];
}

function getDaysInMonth(dateString) {
    const [year, month] = dateString.split("-").map(Number);

    // Get the last day of the month
    const lastDay = new Date(year, month, 0).getDate();

    return lastDay;
}

const calculateDays = (period_type, period) => {
    if (period_type.toUpperCase() == "DAY") {
        return 1;
    } else if (period_type.toUpperCase() == "WEEK") {
        return 7;
    } else if (period_type.toUpperCase() == "MONTH") {
        return getDaysInMonth(period);
    }

    return 1;
};

module.exports = {
    getWeekDateRange,
    getLastDateOfMonth,
    calculateDays,
};
