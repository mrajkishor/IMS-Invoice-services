export const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
};

export const validatePassword = (password: string): boolean => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return re.test(password);
};

export const validateMobileNumber = (mobileNumber: string): boolean => {
    // This regex checks for international phone numbers in E.164 format
    const mobileRegex = /^\+?[1-9]\d{1,14}$/;
    return mobileRegex.test(mobileNumber);
};
