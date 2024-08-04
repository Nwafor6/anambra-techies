import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  email: string;
  fullname: string;
  password: string;
  userType: 'employer' | 'talent' | 'admin';
  isVerified: boolean;
  personalAddress?: string;
  businessAddress?: string;
  postalCode?:string
  state?: string;
  city?: string;
  country?: string;
  website?: string;
  about?: string;
  address?: string;
  picture?: Types.ObjectId;
  sendMeTalentTipsAndNewLetter?:boolean,
  termsAndConditions?:boolean,
  fcmToken:string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IStack extends Document {
  user: Types.ObjectId;
  stackName?: string;
  experienceLevel?: string;
  yearsOfExperience?: number;
  portfolioLink?: string;
  githubLink?: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface IWorkExperience extends Document {
  user: Types.ObjectId;
  positionHeld?: string;
  companyName?: string;
  companyLocation?: string;
  startDate?: Date;
  endDate?: Date;
  workDescription?: string;
  createdAt: Date;
  updatedAt: Date;
};
export interface IEducation extends Document {
  user: Types.ObjectId;
  institutionName?: string;
  institutionLocation?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};
export interface ISkills extends Document {
  user: Types.ObjectId;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
};
export interface IHobbies extends Document {
  user: Types.ObjectId;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface ISocialLink extends Document {
  user: Types.ObjectId;
  name?: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface Imedia extends Document{
    file:string,
    key:string,
};
export interface Itoken extends Document{
    email: string;
    token: string;
    created_at?: Date;
    expires_at: Date;
  };

export interface ITalent extends Document {
  name: string;
  location: string;
  stack: 'Newbie' | 'Frontend Developer' | 'Backend Developer' | 'UI/UX Designer' | 'Product Manager' | 'Data Analyst' | 'Other';
  other?: string;
  learningGoals?: string;
  whatsappNumber: string;
  onboarded?: boolean; // Add this line
  email: string;
}