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
exports.TourController = void 0;
const tour_service_1 = require("./tour.service");
// tour types
const createTourType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield tour_service_1.TourService.createTourType(req, res, next);
});
const allToursType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield tour_service_1.TourService.allToursType(req, res, next);
});
const updateToursType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield tour_service_1.TourService.updateToursType(req, res, next);
});
const deleteToursType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield tour_service_1.TourService.deleteToursType(req, res, next);
});
// tour
const createTour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield tour_service_1.TourService.createTour(req, res, next);
});
const allTours = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield tour_service_1.TourService.allTours(req, res, next);
});
const updateTour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield tour_service_1.TourService.updateTour(req, res, next);
});
const getSingleTour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield tour_service_1.TourService.getSingleTour(req, res, next);
});
const deleteTour = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield tour_service_1.TourService.deleteTour(req, res, next);
});
exports.TourController = { createTourType, allToursType, updateToursType, deleteToursType, createTour, allTours, updateTour, deleteTour, getSingleTour };
