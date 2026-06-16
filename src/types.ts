export interface UserSession {
  fullName: string;
  phoneNumber: string;
  password?: string;
  memberCode: string; // e.g. #0013
  memberClass: string; // e.g. CLASS_PLATINUM
  isRegistered: boolean; // default false, turns true after completing sign-up
  isLoggedIn: boolean; // default false
  workoutsCount: number;
}

export type AppScreen =
  | "LOGIN"
  | "REGISTER_STEP_1"
  | "REGISTER_STEP_2"
  | "REGISTER_STEP_3"
  | "HOME"
  | "PRICING"
  | "CHAT_AI"
  | "SUPPORT_LIST"
  | "SUPPORT_CHAT";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface GymPackage {
  id: string;
  name: string;
  durationLabel: string;
  priceValue: string;
  originalPrice?: string;
  description: string;
  features: string[];
  gradient: string;
}

export interface SupportContact {
  id: string;
  name: string;
  roleLabel: string;
  avatarChar: string;
  bio: string;
  initialMessage: string;
  category: "pt" | "support";
  isOnline: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  type: "welcome" | "auth" | "promo" | "workout" | "billing" | "message";
}

