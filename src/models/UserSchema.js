const mongoose = require("mongoose");
const joi = require("joi");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minLenght: 3,
      maxLenght: 15,
      trim: true,
      match: /^[a-zA-Z0-9\_-]{3,15}$/,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
      type: String,
      required: true,
      minLenght: 8,
      maxLenght: 16,
      trim: true,
    },
    passwordcon: {
      type: String,
      required: true,
      minLenght: 8,
      maxLenght: 16,
      trim: true,
    },
    cv: { type: String },
    avatar: { type: String },
    age: { type: Date },
    about: { type: String },
    jobtitle: { type: String },
    country: { type: String },
    status: { type: String, enum: ["free", "part-time", "full-time"] },
    fname: { type: String, maxLenght: 30, trim: true },
    lname: { type: String, maxLenght: 30, trim: true },
    verifed: { type: Boolean, default: false },
    code: { type: Number, length: 6 },
    IlinkData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IlinkData",
    },
  },

  { timestamps: true }
);

const UserSc = mongoose.model("user", userSchema);

function ValCreateUser(obj) {
  const schema = joi.object({
    username: joi
      .string()
      .trim()
      .min(3)
      .max(15)
      .required()
      .regex(/^[a-zA-Z0-9\_-]{3,15}$/)
      .messages({
        "string.min": `username must be at least 3 char`,
        "string.pattern.base": "invalid username",
      }),
    email: joi
      .string()
      .trim()
      .required()
      .regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
      .messages({
        "any.required": " is a required field",
        "object.regex": "invalid email",
      }),
    password: joi
      .string()
      .trim()
      .min(8)
      .max(16)
      .required()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d[\]{};:=<>_+^#$@!%*?&]{8,16}$/
      )
      .messages({
        "string.min": `password must be at least 8 char`,
        "any.required": " is a required field",
        "object.regex": "invalid password",
        "string.pattern.base": "invalid password",
      }),
    passwordcon: joi.string().required().valid(joi.ref("password")).messages({
      "any.only": "Password not match",
    }),
  });
  return schema.validate(obj);
}

function ValLoginUser(obj) {
  const schema = joi.object({
    email: joi.string().trim().required(),
    password: joi.string().trim().min(8).max(16).required().messages({
      "string.min": `password must be at least 8 char`,
      "any.required": " is a required field",
      "object.regex": "invalid password",
      "string.pattern.base": "invalid password",
    }),
  });
  return schema.validate(obj);
}

function ValUpdateUser(obj) {
  const schema = joi.object({
    cv: joi.string().optional(),
    avatar: joi.string().optional(),
    fname: joi.string().max(30).trim(),
    lname: joi.string().max(30).trim(),
    jobtitle: joi.string(),
    verifed: joi.bool().default(false),
    age: joi.date().allow(""),
    about: joi.string().allow(""),
    status: joi.string().trim().valid("full-time", "free", "part-time"),
    country: joi.string().trim().allow(""),
  });
  return schema.validate(obj);
}

function validateResetPass(obj) {
  const schema = joi.object({
    password: joi
      .string()
      .trim()
      .min(8)
      .max(16)
      .required()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d[\]{};:=<>_+^#$@!%*?&]{8,30}$/
      )
      .messages({
        "string.min": `password must be at least 8 char`,
        "any.required": " is a required field",
        "object.regex": "invalid password",
        "string.pattern.base": "invalid password",
      }),
    passwordcon: joi.string().required().valid(joi.ref("password")).messages({
      "any.only": "Password not match",
    }),
  });
  return schema.validate(obj);
}

module.exports = {
  UserSc,
  ValCreateUser,
  ValLoginUser,
  ValUpdateUser,
  validateResetPass,
};
