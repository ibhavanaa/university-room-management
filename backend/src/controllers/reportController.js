const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const Booking = require('../models/Booking');
const Maintenance = require('../models/Maintenance');
const User = require('../models/User');

// Helper function to handle different date formats
const formatDate = (date) => {
    if (!date) return 'N/A';
    
    if (date instanceof Date) {
        return date.toDateString();
    } else if (typeof date === 'string') {
        const dateObj = new Date(date);
        return isNaN(dateObj.getTime()) ? date : dateObj.toDateString();
    } else if (typeof date === 'number') {
        return new Date(date).toDateString();
    } else {
        return String(date);
    }
};

// desc    Export bookings as Excel
// route   GET /api/reports/bookings/excel
// access  Admin
exports.exportBookingsExcel = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('room', 'name building');

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Bookings');

        // Add headers
        worksheet.addRow(['User', 'Room', 'Date', 'Start Time', 'End Time', 'Status']);

        // Add data - Handle both Date objects and date strings
        bookings.forEach(booking => {
            let dateString;
            
            // Check if booking.date is a Date object or a string
            if (booking.date instanceof Date) {
                dateString = booking.date.toDateString();
            } else if (typeof booking.date === 'string') {
                // If it's a string, try to convert to Date first
                const dateObj = new Date(booking.date);
                dateString = isNaN(dateObj.getTime()) ? booking.date : dateObj.toDateString();
            } else {
                dateString = 'Invalid Date';
            }

            worksheet.addRow([
                booking.user?.name || 'N/A',
                booking.room?.name || 'N/A',
                dateString,
                booking.startTime || 'N/A',
                booking.endTime || 'N/A',
                booking.status || 'N/A'
            ]);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=bookings.xlsx');
        
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// desc    Export bookings as CSV
// route   GET /api/reports/bookings/csv
// access  Admin
exports.exportBookingsCSV = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('room', 'name building');

        // Format the data first to handle dates properly
        const formattedBookings = bookings.map(booking => ({
            user: booking.user?.name || 'N/A',
            room: booking.room?.name || 'N/A',
            date: formatDate(booking.date), // Use helper function
            startTime: booking.startTime || 'N/A',
            endTime: booking.endTime || 'N/A',
            status: booking.status || 'N/A'
        }));

        const fields = ['user', 'room', 'date', 'startTime', 'endTime', 'status'];
        const parser = new Parser({ fields });
        const csv = parser.parse(formattedBookings);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=bookings.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// desc    Export bookings as PDF
// route   GET /api/reports/bookings/pdf
// access  Admin
exports.exportBookingsPDF = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email role')
            .populate('room', 'name building department')
            .sort({ date: 1, startTime: 1 });

        const doc = new PDFDocument({ margin: 50 });
        
        // Set headers before piping
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=bookings-report.pdf');
        
        // Pipe the document to response
        doc.pipe(res);

        // Add simple header
        doc.fontSize(20)
           .text('BOOKING REPORT', 50, 50, { align: 'center' })
           .fontSize(12)
           .text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 80);

        // Add summary
        doc.fontSize(14)
           .text('SUMMARY', 50, 120)
           .fontSize(10)
           .text(`Total Bookings: ${bookings.length}`, 50, 140);

        let yPosition = 170;

        // Add bookings list
        bookings.forEach((booking, index) => {
            if (yPosition > 700) {
                doc.addPage();
                yPosition = 50;
            }

            doc.fontSize(12)
               .text(`${index + 1}. ${booking.user.name} - ${booking.room.name}`, 50, yPosition)
               .fontSize(10)
               .text(`   Date: ${formatDate(booking.date)} | Time: ${booking.startTime}-${booking.endTime} | Status: ${booking.status}`, 50, yPosition + 15);
            
            yPosition += 40;
        });

        // Finalize the PDF and end the response
        doc.end();

    } catch (error) {
        console.error('PDF generation error:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: error.message });
        }
    }
};