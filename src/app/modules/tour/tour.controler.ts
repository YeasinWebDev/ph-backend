import { NextFunction, Request, Response } from "express";
import { TourService } from "./tour.service";


// tour types
const createTourType = async (req: Request, res: Response, next: NextFunction) => {
    await TourService.createTourType(req, res, next);
};

const allToursType = async (req: Request, res: Response, next: NextFunction) => {
    await TourService.allToursType(req, res, next);
}

const updateToursType = async (req: Request, res: Response, next: NextFunction) => {
    await TourService.updateToursType(req, res, next);
}

const deleteToursType = async (req: Request, res: Response, next: NextFunction) => {
    await TourService.deleteToursType(req, res, next);
}


// tour

const createTour = async (req: Request, res: Response, next: NextFunction) => {
    await TourService.createTour(req, res, next);
}

const allTours = async (req: Request, res: Response, next: NextFunction) => {
    await TourService.allTours(req, res, next);
}

const updateTour = async (req: Request, res: Response, next: NextFunction) => {
    await TourService.updateTour(req, res, next);
}

const deleteTour = async (req: Request, res: Response, next: NextFunction) => {
    await TourService.deleteTour(req, res, next);
}

export const TourController = { createTourType, allToursType , updateToursType, deleteToursType, createTour, allTours, updateTour,deleteTour };