const DEFAULT_STUDENTS = [
  { name: "Ali Khan", email: "ali@example.com", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop" },
  { name: "Sara Ahmed", email: "sara@example.com", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { name: "John Doe", email: "john@example.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }
];

const INITIAL_DB = {
  "Ali Khan": {
    academic: [
      { id: 1, title: "Web Development Roadmap", type: "PDF", url: "#", date: "2026-05-18" },
      { id: 2, title: "React Components Lecture Note", type: "Doc", url: "#", date: "2026-05-19" }
    ],
    liveClasses: [
      { id: 1, topic: "Advanced State Management in React", time: "Today at 5:00 PM", url: "https://zoom.us" }
    ],
    leaveRequests: [
      { id: 1, date: "2026-05-22", reason: "Medical checkup", status: "Pending" }
    ],
    homework: [
      { id: 1, title: "Create a Redux Store", desc: "Build a counter store using Redux Toolkit", status: "Assigned", date: "2026-05-20" }
    ],
    feesHistory: [
      { month: 'Jan', amount: 500, status: 'Paid', datePaid: '2026-01-10' },
      { month: 'Feb', amount: 500, status: 'Paid', datePaid: '2026-02-12' },
      { month: 'Mar', amount: 500, status: 'Paid', datePaid: '2026-03-08' },
      { month: 'Apr', amount: 500, status: 'Paid', datePaid: '2026-04-09' },
      { month: 'May', amount: 650, status: 'Pending' },
    ],
    messages: [
      { sender: "admin", text: "Welcome to the Skills & Career program! Let me know if you need any help.", time: "1 day ago" }
    ],
    supervision: { remarks: "Good progress. Active participant.", grade: "A" }
  },
  "Sara Ahmed": {
    academic: [],
    liveClasses: [],
    leaveRequests: [],
    homework: [],
    feesHistory: [
      { month: 'Jan', amount: 500, status: 'Paid', datePaid: '2026-01-08' },
      { month: 'Feb', amount: 500, status: 'Paid', datePaid: '2026-02-10' }
    ],
    messages: [],
    supervision: { remarks: "Needs to complete assignments on time.", grade: "B-" }
  },
  "John Doe": {
    academic: [],
    liveClasses: [],
    leaveRequests: [],
    homework: [],
    feesHistory: [],
    messages: [],
    supervision: { remarks: "Excellent performance in mock exams.", grade: "A+" }
  }
};

const initDB = () => {
  if (!localStorage.getItem("skills_career_db")) {
    localStorage.setItem("skills_career_db", JSON.stringify(INITIAL_DB));
  }
  if (!localStorage.getItem("skills_career_students")) {
    localStorage.setItem("skills_career_students", JSON.stringify(DEFAULT_STUDENTS));
  }
};

export const skillsDb = {
  getStudents: () => {
    initDB();
    return JSON.parse(localStorage.getItem("skills_career_students"));
  },
  
  getStudentData: (studentName) => {
    initDB();
    const db = JSON.parse(localStorage.getItem("skills_career_db"));
    return db[studentName] || {
      academic: [],
      liveClasses: [],
      leaveRequests: [],
      homework: [],
      feesHistory: [],
      messages: [],
      supervision: { remarks: "No record", grade: "N/A" }
    };
  },

  saveStudentData: (studentName, data) => {
    initDB();
    const db = JSON.parse(localStorage.getItem("skills_career_db"));
    db[studentName] = data;
    localStorage.setItem("skills_career_db", JSON.stringify(db));
  },

  addMessage: (studentName, sender, text, fileType = null, fileUrl = null) => {
    const data = skillsDb.getStudentData(studentName);
    data.messages.push({
      sender,
      text,
      fileType,
      fileUrl,
      time: "Just now"
    });
    skillsDb.saveStudentData(studentName, data);
  },

  addLeaveRequest: (studentName, date, reason) => {
    const data = skillsDb.getStudentData(studentName);
    data.leaveRequests.push({
      id: Date.now(),
      date,
      reason,
      status: "Pending"
    });
    skillsDb.saveStudentData(studentName, data);
  },

  addHomework: (studentName, title, desc, fileUrl = null) => {
    const data = skillsDb.getStudentData(studentName);
    data.homework.push({
      id: Date.now(),
      title,
      desc,
      status: "Assigned",
      fileUrl,
      date: new Date().toISOString().split('T')[0]
    });
    skillsDb.saveStudentData(studentName, data);
  },

  addFeeRecord: (studentName, month, amount, status) => {
    const data = skillsDb.getStudentData(studentName);
    data.feesHistory.push({
      month,
      amount: parseFloat(amount),
      status,
      datePaid: status === 'Paid' ? new Date().toISOString().split('T')[0] : null
    });
    skillsDb.saveStudentData(studentName, data);
  },

  addLiveClass: (studentName, topic, time, url) => {
    const data = skillsDb.getStudentData(studentName);
    data.liveClasses.push({
      id: Date.now(),
      topic,
      time,
      url
    });
    skillsDb.saveStudentData(studentName, data);
  },

  addAcademicAttachment: (studentName, title, type, url) => {
    const data = skillsDb.getStudentData(studentName);
    data.academic.push({
      id: Date.now(),
      title,
      type,
      url,
      date: new Date().toISOString().split('T')[0]
    });
    skillsDb.saveStudentData(studentName, data);
  }
};
