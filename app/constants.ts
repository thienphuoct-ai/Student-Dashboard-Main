export interface TimetableEntry {
  time: string;
  roomNumber: string;
  subject: string;
  type: string;
}

export const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const timetableData: Record<number, TimetableEntry[]> = {
  0: [{ time: 'Sunday', roomNumber: 'Holiday', subject: 'No class Available', type: '' }],
  1: [
    { time: '09-10 AM', roomNumber: '38-718', subject: 'DBMS130', type: 'Lecture' },
    { time: '10-11 AM', roomNumber: '38-718', subject: 'MTH166', type: 'Tutorial' },
    { time: '12-01 PM', roomNumber: '38-718', subject: 'NS200', type: 'Lecture' }
  ],
  2: [
    { time: '09-10 AM', roomNumber: '27-304Y', subject: 'MTH166', type: 'Tutorial' },
    { time: '11-12 AM', roomNumber: '28-107', subject: 'CS849', type: 'Lecture' },
    { time: '12-01 PM', roomNumber: '28-107', subject: 'CS849', type: 'Lecture' },
    { time: '02-03 PM', roomNumber: '38-718', subject: 'NS200', type: 'Lecture' }
  ],
  3: [
    { time: '10-11 AM', roomNumber: '33-309', subject: 'DBMS130', type: 'Lecture' },
    { time: '11-12 AM', roomNumber: '38-719', subject: 'CS200', type: 'Lecture' }
  ],
  4: [
    { time: '11-12 AM', roomNumber: '33-309', subject: 'MTH166', type: 'Lecture' },
    { time: '01-02 PM', roomNumber: '38-719', subject: 'CS849', type: 'Lecture' },
    { time: '02-03 PM', roomNumber: '38-718', subject: 'NS200', type: 'Lecture' }
  ],
  5: [
    { time: '10-11 AM', roomNumber: '33-309', subject: 'MEC103', type: 'Lecture' },
    { time: '11-12 AM', roomNumber: '33-309', subject: 'MEC103', type: 'Lecture' },
    { time: '02-03 PM', roomNumber: '33-601', subject: 'CS849', type: 'Tutorial' }
  ],
  6: [
    { time: '09-10 AM', roomNumber: '34-604', subject: 'DBMS130', type: 'Tutorial' },
    { time: '10-11 AM', roomNumber: '34-604', subject: 'DBMS130', type: 'Lecture' },
    { time: '01-02 PM', roomNumber: '33-309', subject: 'MTH166', type: 'Lecture' }
  ]
};