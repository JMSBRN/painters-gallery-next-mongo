export interface User {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface SignUpErrors {
    confirm: string,
    exist: string
}
