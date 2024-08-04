import { Schema, model, Model } from 'mongoose';
import { IEducation, IHobbies, ISkills, ISocialLink, IStack, IUser, IWorkExperience, Imedia, Itoken } from '../interfaces/users';
import bcrypt from "bcrypt"

const UserSchema:Schema<IUser> = new Schema<IUser>({
    fullname: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, default:"talent" },
    isVerified: { type: Boolean, default: false },
    personalAddress: String,
    businessAddress: String,
    state: String,
    city: String,
    country: String,
    website:String,
    address: String,
    about:String,
    postalCode:String,
    picture: { type: Schema.Types.ObjectId, ref: 'Media' },
    sendMeTalentTipsAndNewLetter:{ type: Boolean, default: false },
    termsAndConditions:{ type: Boolean, default: true },
    fcmToken:{
      type:String,
      default:""
    }
  }, { timestamps: true });

  UserSchema.pre("save", async function (next) {
    try {
      if (this.isNew) {
        // Hash password for all user types
        this.password = await bcrypt.hash(this.password, 10);
  
        // If userType is "talent", check if the user has a stack, else create one
        if (this.userType === "talent") {
          const stack = await Stack.findOne({ user: this._id }).select("_id");
          if (!stack) {
            await Stack.create({ user: this._id });
          }
        }
      }
      next();
    } catch (error:any) {
      next(error);
    }
  });

const StackSchema: Schema<IStack> = new Schema<IStack>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  stackName: {
    type: String,
  },
  experienceLevel: {
    type: String,
  },
  yearsOfExperience: {
    type: Number,
  },
  portfolioLink: {
    type: String,
  },
  githubLink: {
    type: String,
  },
}, { timestamps: true });

const WorkExperienceSchema: Schema<IWorkExperience> = new Schema<IWorkExperience>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  positionHeld: {
    type: String,
  },
  companyName: {
    type: String,
  },
  companyLocation: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  workDescription: {
    type: String,
  },
}, { timestamps: true });

const EducationSchema: Schema<IEducation> = new Schema<IEducation>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  institutionName: {
    type: String,
  },
  institutionLocation: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  description: {
    type: String,
  },
}, { timestamps: true });

const SkillsSchema: Schema<ISkills> = new Schema<ISkills>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  name: {
    type: String,
  },
}, { timestamps: true });

const HobbiesSchema: Schema<IHobbies> = new Schema<IHobbies>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  name: {
    type: String,
  },
}, { timestamps: true });

const SocialLinkSchema: Schema<ISocialLink> = new Schema<ISocialLink>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  name: {
    type: String,
  },
  link: {
    type: String,
  },
}, { timestamps: true });

const MediaSchema :Schema<Imedia> = new Schema<Imedia>({
    file:{
        type:String,
        required:true
    },
    key:{
        type:String,
        required:true
    }
},{timestamps:true})

const TokenSchema:Schema<Itoken> = new Schema<Itoken>({
    email: {
      type: String,
      required:true
    },
    token: {
      type: String,
      required:true
    },
    created_at: {
      type: Date,
      default:Date.now,
      required:false
    },
    expires_at: {
      type: Date,
      required:true
    },
  })
export const Media: Model<Imedia> = model<Imedia>('Media', MediaSchema);
export const User:Model<IUser> = model<IUser>('User', UserSchema);
export const Token: Model<Itoken> = model<Itoken>('Token', TokenSchema);

export const Stack: Model<IStack> = model<IStack>('Stack', StackSchema);
export const WorkExperience: Model<IWorkExperience> = model<IWorkExperience>('WorkExperience', WorkExperienceSchema);
export const Education: Model<IEducation> = model<IEducation>('Education', EducationSchema);
export const Skills: Model<ISkills> = model<ISkills>('Skills', SkillsSchema);
export const Hobbies: Model<IHobbies> = model<IHobbies>('Hobbies', HobbiesSchema);
export const SocialLink: Model<ISocialLink> = model<ISocialLink>('SocialLink', SocialLinkSchema);