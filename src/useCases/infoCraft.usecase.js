const createError = require("http-errors");
const mongoose = require("mongoose");

const User = require("../models/user.model");
const Craftman = require("../models/craftsman.model");

async function getCraftmanModal(userId) {
    if (!mongoose.isValidObjectId(userId)) {
        throw new createError(400, "Id invalido");
    }
    const craftmanObject = new mongoose.Types.ObjectId(userId);
    const getCraftmanCal = await Craftman.findOne({ user: craftmanObject });
    if (!getCraftmanCal) {
        throw new createError(404, "Craftman no encontrado");
    }
    const craftman= await Craftman.find({isCraftsman: "accepted"})
    .select("user")
    .populate({
        path: "user",
        select: "avatar name surname",
        populate: { path: "avatar", select: "url" },
      })

      return craftman
    }

    async function ratingCraftman(userId,craftmanObject){
        if (!mongoose.isValidObjectId(userId)) {
            throw new createError(400, "Id invalido");
        }
        const craftmanObject = new mongoose.Types.ObjectId(userId);
        const CraftmanCal = await Craftman.findOne({ user: craftmanObject });
        if (!CraftmanCal) {
            throw new createError(404, "Craftman no encontrado");
        }
        const rating= await Craftman.create(craftmanObject)

        return rating
    }

    module.exports = {
        getCraftmanModal
    }