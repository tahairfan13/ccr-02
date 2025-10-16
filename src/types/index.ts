export type ApplicationType = "ai" | "blockchain" | "mobile" | "web";

export type ProjectScale = "mvp" | "mid" | "enterprise";

export interface Feature {
  id: string;
  name: string;
  description: string;
  hours: number;
  selected: boolean;
  category?: string;
}

export interface FormData {
  applicationTypes: ApplicationType[];
  projectScale: ProjectScale | null;
  description: string;
  features: Feature[];
  name: string;
  email: string;
  country: string;
  countryCode: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface VerificationState {
  email: {
    code: string;
    verified: boolean;
    loading: boolean;
  };
  phone: {
    code: string;
    verified: boolean;
    loading: boolean;
  };
}
