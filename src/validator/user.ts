import Joi from 'joi';
import mongoose from 'mongoose';

export const objectIdValidator =Joi.extend((Joi)=>({
  type: 'objectId',
  base: Joi.string(),
  messages: {
    'objectId.invalid': 'objectId should be a valid id',
  },
  validate(value, helpers) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return { value, errors: helpers.error('objectId.invalid') };
    }
  },
}))

export const userValidator = Joi.object({
  email: Joi.string().email().required(),
  fullname: Joi.string().required(),
  password: Joi.string()
    .required()
    .min(8) // Minimum length of 8 characters
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')) // Password complexity rules
    .message('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.'),
  // userType: Joi.string().valid('talent', 'employer').required(),
  sendMeTalentTipsAndNewLetter:Joi.boolean().required(),
  termsAndConditions: Joi.boolean().required()
});

export const updateUserValidator = Joi.object({
  fullname: Joi.string().allow(""),
  personalAddress: Joi.string().allow(""),
  businessAddress: Joi.string().allow(""),
  postalCode: Joi.string().allow(""),
  state: Joi.string().allow(""),
  city: Joi.string().allow(""),
  country: Joi.string().allow(""),
  website: Joi.string().uri().allow(""),
  about: Joi.string().allow(""),
  address: Joi.string().allow(""),
  picture: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).allow(""), // Assuming picture is an ObjectId
});

export const emailValidator = Joi.object({
  email: Joi.string().email().required(),

});

export const emailVerificationValidator=Joi.object({
  email: Joi.string().email().required(),
  token: Joi.string().min(4).max(4).required(),

})


export const loginValidator=Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  fcmToken:Joi.string().allow(""),

})

export const resetPasswordValidator=Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
        .required()
        .min(8) // Minimum length of 8 characters
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')) // Password complexity rules
        .message('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.'),
  token: Joi.string().min(4).max(4).required(),

});
export const ChangePasswordInDashboardValidator=Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
})