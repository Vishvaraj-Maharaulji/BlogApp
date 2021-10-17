const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML!",
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error("string.escapeHTML", { value });
                return clean;
            },
        },
    },
});

const Joi = BaseJoi.extend(extension);

module.exports.blogSchema = Joi.object({
    blog: Joi.object({
        title: Joi.string().required().escapeHTML(),
        body: Joi.string().required().escapeHTML(),
    }).required(),
    deleteImages: Joi.array(),
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        text: Joi.string().required().escapeHTML(),
    }).required(),
});

module.exports.replySchema = Joi.object({
    reply: Joi.object({
        text: Joi.string().required().escapeHTML(),
    }).required(),
});
