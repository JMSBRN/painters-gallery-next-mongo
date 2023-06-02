import bcrypt from 'bcryptjs';

const encryptPassowrd = async (nakedPassword: string) => {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassowrd = await  bcrypt.hash(nakedPassword, salt);
    if(encryptedPassowrd) {
        return encryptedPassowrd;
    } else {
        return null;
    }
};
const checkBcryptedPassword = async (inputValue: string, encryptedValue: string) => {
    const matchedPsw: boolean = await bcrypt.compare(inputValue, encryptedValue);
    return matchedPsw;
};
 
const BcryptUtils = {
    encryptPassowrd,
    checkBcryptedPassword
};

export default BcryptUtils;
