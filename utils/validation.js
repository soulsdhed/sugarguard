const isValidDate = (dateString) => {
    // Check for null or undefined
    if (dateString == null) {
        return false;
    }
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
        return false;
    }

    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return (
        date.getFullYear() === year &&
        date.getMonth() + 1 === month &&
        date.getDate() === day
    );
};

const isValidWeek = (dateString) => {
    // Check for null or undefined
    if (dateString == null) {
        return false;
    }
    const regex = /^\d{4}-\d{2}$/;
    if (!regex.test(dateString)) {
        return false;
    }

    const [year, week] = dateString.split("-").map(Number);
    return year > 0 && week >= 1 && week <= 53;
};

const isValidMonth = (dateString) => {
    // Check for null or undefined
    if (dateString == null) {
        return false;
    }
    const regex = /^\d{4}-\d{2}$/;
    if (!regex.test(dateString)) {
        return false;
    }

    const [year, month] = dateString.split("-").map(Number);
    return year > 0 && month >= 1 && month <= 12;
};

const isValidURL = (url) => {
    const urlPattern = new RegExp(
        "^(https?:\\/\\/)" + // protocol
        "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.?)+[a-zA-Z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?" + // port
        "(\\/[-a-zA-Z\\d%@_.~+&:]*)*" + // path
        "(\\?[;&a-zA-Z\\d%@_.,~+&:=-]*)?" + // query string
        "(\\#[-a-zA-Z\\d_]*)?$", // fragment locator
        "i" // case insensitive
    );

    return !!urlPattern.test(url);
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPassword = (password) => {
    const allowedSpecialCharacters = '!@#$%^&*(),.?":{}|<>'; // 사용할 수 있는 특수 문자 정의
    const specialCharPattern = new RegExp('^[a-zA-Z0-9' + allowedSpecialCharacters.split('').map(char => '\\' + char).join('') + ']*$');

    // 비밀 번호 글자수 부족 혹은 과다
    if (password.length < 8 || password.length > 16) {
        return false;
    }
    // 비밀번호에 영어, 숫자, 특문 이외의 문자가 있으면 안된다
    if (!/^[\x00-\x7F]*$/.test(password)) {
        return false;
    }
    // 특수 문자 제한
    if (!specialCharPattern.test(password)) {
        return false;
    }
    return true;
}

module.exports = {
    isValidDate,
    isValidWeek,
    isValidMonth,
    isValidURL,
    isValidEmail,
    isValidPassword
};
