"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    // @ts-expect-error // host type error
    host: (_a = process.env.SMTP_HOST) !== null && _a !== void 0 ? _a : "smtp.gmail.com",
    port: process.env.SMTP_PORT,
    secure: parseInt((_b = process.env.SMTP_PORT) !== null && _b !== void 0 ? _b : '') === 465 ? true : false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
const sendEmail = ($options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transporter.sendMail({
            from: `shop-kart <${process.env.SMTP_USER}>`,
            subject: $options.subject,
            to: $options.to,
            html: $options.html
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendEmail = sendEmail;
