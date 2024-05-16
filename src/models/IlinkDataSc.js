const Joi = require("joi");
const mongoose = require("mongoose");

const IlinkData = new mongoose.Schema({
  socialMediaLinks: {
    facebookUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    twitterUrl: {
      type: String,
    },
    instagramUrl: {
      type: String,
    },
    whatsappUrl: {
      type: Number,
    },
    youtubeUrl: {
      type: String,
    },
    linkedinUrl: {
      type: String,
    },
    tiktokUrl: { type: String },
  },
  portfolio: [
    {
      imgurl: { type: String },
      protitle: { type: String },
      cleintname: { type: String },
      prourl: { type: String },
      prodesc: { type: String },
      protype: { type: String },
    },
  ],
  skills: [
    {
      skillname: { type: String },
      skillperc: { type: String },
    },
  ],
});

const IlinkDataSc = mongoose.model("IlinkData", IlinkData);

const socialMediaLinks = Joi.object().keys({
  facebookUrl: Joi.string().allow(""),
  githubUrl: Joi.string().allow(""),
  twitterUrl: Joi.string().allow(""),
  instagramUrl: Joi.string().allow(""),
  whatsappUrl: Joi.string().allow(""),
  youtubeUrl: Joi.string().allow(""),
  linkedinUrl: Joi.string().allow(""),
  tiktokUrl: Joi.string().allow(""),
});

const portfolio = Joi.array().items(
  Joi.object({
    imgname: Joi.string().required(),
    protitle: Joi.string().required(),
    cleintname: Joi.string().required(),
    prourl: Joi.string().required(),
    prodesc: Joi.string().required(),
    protype: Joi.string().required(),
  })
);

const skills = Joi.array().items(
  Joi.object({
    skillname: Joi.string().required(),
    skillperc: Joi.string().required(),
  })
);

function ValidateCreateIlinkData(obj) {
  const Schema = Joi.object().keys({
    socialMediaLinks,
    portfolio,
    skills,
  });
  return Schema.validate(obj);
}

module.exports = {
  IlinkDataSc,
  ValidateCreateIlinkData,
};
