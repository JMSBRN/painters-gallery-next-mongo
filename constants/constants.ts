
export enum Regex {
 'FIRST_NAME'='^[A-Za-z]{2,32}$',
 'PASSWORD'='^(?=.*[0-9])(?=.*[a-z]).{8,16}$'
}
export enum RegexHelperMessages {
    'FIRST_NAME'='min-max 3-32, A-z',
    'PASSWORD'='min-max 8-16, min one A-z, min one 9-0, min one special character'
}
export enum FormErrorMessages {
  NAME_ERROR='User with this name already exist',
  EMAIL_ERROR='User with this email already exist',
  USER_ERROR='User not Found',
  USER_AUTH_ERROR='User Unauthorized',
  PASSWORD_VALID_ERROR='Password not valid',
  PASSWORD_CONFIRM_ERROR='Passwords not match'
}

export enum ResponseMessages {
  DATA_DELETED='Data deleted',
  DATA_NOT_DELETED='Data not deleted',
  DATA_NOT_FOUND='Data not found',
  DATA_UPLOADED='Data Uploaded',
  UNSUPPORTED_MEDIA_TYPE='Unsupported Media Type',
  CONNECTION_FAILED='Connection Failed',
  DATA_CREATED='Data Created',
  MONGO_ERROR='Error from MongoDb',
  METHOD_NOT_ALLOWED='Method not allowed',
  SERVER_ERROR='Server Error'
}