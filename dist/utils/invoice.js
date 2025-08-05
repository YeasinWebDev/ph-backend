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
exports.generatePdf = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const AppError_1 = __importDefault(require("../app/errorHelpers/AppError"));
const generatePdf = (invoiceData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
            const buffer = [];
            doc.on("data", (chunk) => buffer.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffer)));
            doc.on("error", (err) => reject(err));
            // Styling helpers
            const drawLine = () => {
                doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#cccccc").stroke().moveDown(1);
            };
            // Header
            doc
                .fontSize(26)
                .fillColor("#333333")
                .text("Dream Tours Ltd.", { align: "center", underline: true });
            doc.moveDown(1);
            doc
                .fontSize(20)
                .fillColor("#000000")
                .text("INVOICE", { align: "center" });
            doc.moveDown(1);
            drawLine();
            // Transaction Info
            doc
                .fontSize(14)
                .fillColor("#000000")
                .text(`Transaction ID: `, { continued: true }).font("Helvetica-Bold").text(invoiceData.transactionId)
                .font("Helvetica").text(`Booking Date: `, { continued: true }).font("Helvetica-Bold").text(new Date(invoiceData.bookingDate).toLocaleDateString())
                .font("Helvetica").text(`Customer Name: `, { continued: true }).font("Helvetica-Bold").text(invoiceData.userName);
            doc.moveDown();
            drawLine();
            // Booking Details
            doc
                .fontSize(16)
                .fillColor("#333333")
                .text("Booking Details", { underline: true });
            doc.moveDown(0.5);
            doc
                .fontSize(14)
                .fillColor("#000000")
                .text(`Tour Package: `, { continued: true }).font("Helvetica-Bold").text(invoiceData.tourTitle)
                .font("Helvetica").text(`Number of Guests: `, { continued: true }).font("Helvetica-Bold").text(invoiceData.guestCount.toString())
                .font("Helvetica").text(`Total Amount: `, { continued: true }).font("Helvetica-Bold").text(`$${invoiceData.totalAmount.toFixed(2)}`);
            doc.moveDown(1);
            drawLine();
            // Footer
            doc
                .fontSize(12)
                .fillColor("#555555")
                .text("Thank you for booking with us!", { align: "center" });
            doc.moveDown(0.5);
            doc
                .fontSize(10)
                .fillColor("#888888")
                .text("This invoice was generated electronically and is valid without signature.", {
                align: "center"
            });
            doc.end();
        });
    }
    catch (error) {
        console.log(error);
        throw new AppError_1.default(`Pdf creation error ${error}`, 401);
    }
});
exports.generatePdf = generatePdf;
