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
Object.defineProperty(exports, "__esModule", { value: true });
exports.divisionController = void 0;
const division_service_1 = require("./division.service");
const createDivision = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield division_service_1.DivisionService.createDevision(req, res, next);
});
const getAllDivision = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield division_service_1.DivisionService.getAllDevision(req, res, next);
});
const getSingleDivision = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield division_service_1.DivisionService.getSingleDevision(req, res, next);
});
const updateDivision = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield division_service_1.DivisionService.updateDevision(req, res, next);
});
const deleteDivision = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield division_service_1.DivisionService.deleteDivision(req, res, next);
});
exports.divisionController = {
    createDivision,
    getAllDivision,
    updateDivision,
    deleteDivision,
    getSingleDivision
};
