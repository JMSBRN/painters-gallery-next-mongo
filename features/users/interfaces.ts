export interface User {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    token?: string;
    password: string;
    confirmPassword?: string;
}

export interface SignUpErrors {
    nameError: string,
    emailError: string,
    passwordError: string,
}
