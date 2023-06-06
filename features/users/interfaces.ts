export interface User {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface SignUpErrors {
    nameError: string,
    emailError: string,
    passwordError: string,
}

export interface InitFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}