import PDFDocument from "pdfkit";
import AppError from "../app/errorHelpers/AppError";

interface Invoice {
  transactionId: string;
  bookingDate: Date;
  userName: string;
  tourTitle: string;
  guestCount: number;
  totalAmount: number;
}

export const generatePdf = async (invoiceData: Invoice): Promise<Buffer> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffer: Uint8Array[] = [];

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
  } catch (error) {
    console.log(error);
    throw new AppError(`Pdf creation error ${error}`, 401);
  }
};
