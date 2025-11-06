// types.ts

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  skills: string[];
  bio: string;
  avatar: string;
  available: boolean;
}

// Projects
export interface Project {
  id: number;
  title: string;
  description: string;
  requiredSkills: string[];
  creatorId: number;
  members: number[];
}

// Skill Swap Core
export type SkillSwapStatus = 'pending' | 'accepted' | 'declined';

export interface SkillSwap {
  id: number;
  fromUserId: number;
  toUserId: number;
  offeredSkill: string;
  requestedSkill: string;
  status: SkillSwapStatus;
  message: string;
  fromUser?: User;
  toUser?: User;
  created_at?: string;
}

// Messaging inside swap chat
export interface SkillSwapMessage {
  id: number;
  swap_id: number;
  sender_id: number;
  message: string;
  created_at?: string;
  sender_name?: string;
  sender_avatar?: string;
}

// Swap status history
export interface SkillSwapStatusHistory {
  id: number;
  swap_id: number;
  status: SkillSwapStatus;
  changed_by: number;
  created_at?: string;
}
