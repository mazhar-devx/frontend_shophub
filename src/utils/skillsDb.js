const DEFAULT_STUDENTS = [
  { name: "Ali Khan", email: "ali@example.com", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop" },
  { name: "Sara Ahmed", email: "sara@example.com", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { name: "John Doe", email: "john@example.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }
];

const INITIAL_DB = {
  "ali@example.com": {
    academic: [],
    liveClasses: [],
    leaveRequests: [],
    homework: [],
    feesHistory: [],
    messages: [],
    supervision: { remarks: "No remarks yet", grade: "N/A" }
  },
  "sara@example.com": {
    academic: [],
    liveClasses: [],
    leaveRequests: [],
    homework: [],
    feesHistory: [],
    messages: [],
    supervision: { remarks: "No remarks yet", grade: "N/A" }
  },
  "john@example.com": {
    academic: [],
    liveClasses: [],
    leaveRequests: [],
    homework: [],
    feesHistory: [],
    messages: [],
    supervision: { remarks: "No remarks yet", grade: "N/A" }
  }
};

const resolveStudentEmail = (nameOrEmail) => {
  if (!nameOrEmail) return "default_key";
  const normalized = nameOrEmail.toLowerCase().trim();
  const students = JSON.parse(localStorage.getItem("skills_career_students")) || [];
  const found = students.find(s => 
    s.name?.toLowerCase().trim() === normalized || 
    s.email?.toLowerCase().trim() === normalized
  );
  return found ? found.email.toLowerCase().trim() : normalized;
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
  
  getStudentData: (studentNameOrEmail) => {
    initDB();
    const emailKey = resolveStudentEmail(studentNameOrEmail);
    const db = JSON.parse(localStorage.getItem("skills_career_db"));
    return db[emailKey] || {
      academic: [],
      liveClasses: [],
      leaveRequests: [],
      homework: [],
      feesHistory: [],
      messages: [],
      supervision: { remarks: "No remarks yet", grade: "N/A" }
    };
  },

  saveStudentData: (studentNameOrEmail, data) => {
    initDB();
    const emailKey = resolveStudentEmail(studentNameOrEmail);
    const db = JSON.parse(localStorage.getItem("skills_career_db"));
    db[emailKey] = data;
    localStorage.setItem("skills_career_db", JSON.stringify(db));
  },

  registerStudent: (name, email, avatar = null) => {
    initDB();
    const students = JSON.parse(localStorage.getItem("skills_career_students")) || [];
    const normalizedEmail = email?.toLowerCase().trim();
    if (!normalizedEmail) return;

    const existingIndex = students.findIndex(s => 
      s.email?.toLowerCase().trim() === normalizedEmail ||
      s.name?.toLowerCase().trim() === name?.toLowerCase().trim()
    );

    const avatarUrl = avatar 
      ? avatar 
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

    if (existingIndex > -1) {
      students[existingIndex] = {
        ...students[existingIndex],
        name,
        email,
        avatar: avatarUrl
      };
    } else {
      students.push({
        name,
        email,
        avatar: avatarUrl
      });
    }
    localStorage.setItem("skills_career_students", JSON.stringify(students));
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
