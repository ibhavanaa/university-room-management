const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('../models/Room');

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const rooms = await Room.find();

    const dummyTimetable = [
        {
            day: 'Monday',
            lectures: [
                { startTime: '09:00', endTime: '10:00', course: 'Data Structures', faculty: 'Prof. Rao' },
                { startTime: '11:00', endTime: '12:00', course: 'DBMS', faculty: 'Dr. Patel' }
            ]
        },
        {
            day: 'Tuesday',
            lectures: [
                { startTime: '10:00', endTime: '11:00', course: 'Operating Systems', faculty: 'Dr. Singh' },
                { startTime: '02:00', endTime: '03:00', course: 'Networks', faculty: 'Prof. Roy' }
            ]
        },
        {
            day: 'Wednesday',
            lectures: [
                { startTime: '09:30', endTime: '10:30', course: 'AI & ML', faculty: 'Dr. Mehta' }
            ]
        },
        {
            day: 'Thursday',
            lectures: [
                { startTime: '11:00', endTime: '12:00', course: 'Software Engineering', faculty: 'Prof. Verma' }
            ]
        },
        {
            day: 'Friday',
            lectures: [
                { startTime: '01:00', endTime: '02:30', course: 'Cloud Computing', faculty: 'Dr. Nair' }
            ]
        }
    ];

    for (const room of rooms) {
        room.timetable = dummyTimetable;
        await room.save();
    }

    console.log(' Timetable seeded with 5 days for all rooms');
    process.exit();
}).catch(err => {
    console.error(' Error seeding timetable:', err);
    process.exit(1);
});
