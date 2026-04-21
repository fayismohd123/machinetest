// Hospital related types
export interface Hospital {
  hospital_id: number;
  hospital_name: string;
}

export interface PreAuthResponse {
  status: number;
  message: string;
  Hospital: Hospital[];
}

// User authentication types
export interface LoginRequest {
  PhoneNumber: string;
  HospitalID: number | string;
  Password: string;
}

export interface UserInfo {
  Username?: string;
  PhoneNumber?: string;
  HospitalName?: string;
  HospitalID?: number;
  Role?: string;
}

export interface LoginResponse {
  Status: number;
  Token: string;
  Username: string;
  HospitalName: string;
  HospitalID: number;
  Phone: string;
}

// Auth context
export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  token: string | null;
  hospital: Hospital | null;
  login: (phoneNumber: string, hospitalId: number, password: string) => Promise<void>;
  logout: () => void;
  preAuth: (phoneNumber: string) => Promise<Hospital[]>;
}
