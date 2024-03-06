const createError = require("http-errors");
const mongoose = require("mongoose");

const TemplateColors = require("../models/templateColors.model");
const Craftman = require("../models/craftsman.model")
const Template = require("../models/template.model")
const Multimedia = require("../models/multimedia.model")
const WebSite = require("../models/website.model")

async function getTemplateColors() {
    const findTemplateColors = await TemplateColors.find();
    return findTemplateColors;
}

async function updateAditionalB(craftmanId, templateId, aditionalObject, aditionalInfoObject) {
    if (!mongoose.isValidObjectId(craftmanId) || !mongoose.isValidObjectId(templateId)) {
        throw new createError(400, "Id inválido");
    }

    const craftsman = await Craftman.findOne({ user: user._id });
    if (!craftsman) {
        throw new createError(404, "Craftsman no encontrado");
    }

    const template = await Template.findById(templateId)
        .select(
            "name"
        );
    if (!template) {
        throw new createError(404, "Craftsman no cuenta con template");
    }

    if (!template.craftsman._id.equals(craftsman._id)) {
        throw new createError(400, "El template no esta asginado al artesano");
    }

    if (!template.template.name.equals("B")) {
        throw new createError(400, "El template no requiere informacion adicional");
    }

    const newVideo = aditionalObject.newVideo.map((video) => {
        const [, mime, data] = /^data:(video\/\w+);base64,(.+)$/.exec(video) || [];
        if (!mime || !data) {
            throw new createError(500, "Invalid base64 data format");
        }
        const extension = mime.split("/")[1] || "mp4"; // Default to 'mp4' if extension is not found
        const videoBuffer = Buffer.from(data, "base64");

        return { buffer: videoBuffer, extension };
    })
    const results = await s3Service.s3UploadMultiple(newVideo);

    const resultSaveVideo = await Promise.all(
        results.map(async (video) => {
            const objectBannerVideo = {
                url: video.Location,
                key: video.key,
            };
            const saveVideo = await Multimedia.create(objectBannerVideo);
            if (!saveVideo) {
                throw new createError(400, "Error al crear el video");
            }
            return saveVideo._id;
        })
    );

    const isBase64ImageBanner =
        /^data:image\/(jpeg|png|gif|jpg);base64,/.test(aditionalObject.backgroundImage);

    if (isBase64ImageBanner) {
        const [, mimeBannerSection, dataBannerSection] =
            /^data:(image\/\w+);base64,(.+)$/.exec(aditionalObject.backgroundImage) || [];
        if (!mimeBannerSection || !dataBannerSection) {
            throw new createError(400, "formato invalido foto de sección");
        }

        const extensionBannerSection = mimeBannerSection.split("/")[1] || "jpg"; // Default to 'jpg' if extension is not found
        const imageBufferBannerSection = Buffer.from(dataBannerSection, "base64");

        const objectBannerSection = {
            buffer: imageBufferBannerSection,
            extension: extensionBannerSection,
        };

        const uploadBannerSection = await s3Service.s3UploadUnique(
            objectBannerSection
        );

        const objectMultimediaBannerSection = {
            url: uploadBannerSection.Location,
            key: uploadBannerSection.key,
        };
        const saveBannerSection = await Multimedia.create(
            objectMultimediaBannerSection
        );
        if (!saveBannerSection) {
            throw new createError(400, "Error al guardar la imagen de seccion");
        }

        const aditionalInfoUpdated = await WebSite.findByIdAndUpdate(craftsman._id,  {
            sections: [{
                title: aditionalInfoObject.title,
                description: aditionalInfoObject.description,
                backgroundImage: saveBannerSection.backgroundImage
        }],
        video: resultSaveVideo.video

        })
        if(!aditionalInfoUpdated){
            throw new createError(400,"Informacion adaicional no guardada")
           }
           

    }
    return aditionalInfoUpdated
}

    module.exports = {
        getTemplateColors,
        updateAditionalB

    }