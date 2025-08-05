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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Division = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const divisionSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    thumbnail: {
        type: String,
    },
    description: {
        type: String,
    },
}, { timestamps: true, versionKey: false });
divisionSchema.pre("save", function (next) {
    if (!this.isModified("name"))
        return next();
    this.slug = this.name.toLowerCase().split(" ").join("-") + "-" + "division";
    next();
});
divisionSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const update = this.getUpdate();
        ;
        if (!update.name)
            return next();
        update.slug = update.name.toLowerCase().split(" ").join("-") + "-" + "division";
        this.setUpdate(update);
        next();
    });
});
exports.Division = mongoose_1.default.model("Division", divisionSchema);
