
export enum Regex {
 'FIRST_NAME'='^[A-Za-z]{2,32}$',
 'PASSWORD'='^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$'
}
export enum ErrorMessages {
    'FIRST_NAME'='min-max 3-32, A-z',
    'PASSWORD'='min-max 8-16, min one A-z, min one 9-0'
}