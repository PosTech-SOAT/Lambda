export interface SignUpDto {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface SignUpConfirmDto {
  username: string;
  code: string;
}
