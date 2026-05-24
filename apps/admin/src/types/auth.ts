export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthUser {
  email: string;
  name: string;
  role: string;
}
