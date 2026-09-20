const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Skill = require('../models/Skill');
const ProjectIdea = require('../models/ProjectIdea');
const Project = require('../models/Project');
const Team = require('../models/Team');
const TeamRequest = require('../models/TeamRequest');
const GuideRequest = require('../models/GuideRequest');
const Task = require('../models/Task');
const Milestone = require('../models/Milestone');
const Notification = require('../models/Notification');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/projectmate';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB for seeding expanded dataset...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    // Clear existing collection data
    await User.deleteMany({});
    await Skill.deleteMany({});
    await ProjectIdea.deleteMany({});
    await Project.deleteMany({});
    await Team.deleteMany({});
    await TeamRequest.deleteMany({});
    await GuideRequest.deleteMany({});
    await Task.deleteMany({});
    await Milestone.deleteMany({});
    await Notification.deleteMany({});

    console.log('Cleared existing database records.');

    // 1. Seed Skills Master List
    const skillsList = [
      { name: 'Java', category: 'Programming Languages' },
      { name: 'Python', category: 'Programming Languages' },
      { name: 'C', category: 'Programming Languages' },
      { name: 'C++', category: 'Programming Languages' },
      { name: 'JavaScript', category: 'Programming Languages' },
      { name: 'TypeScript', category: 'Programming Languages' },
      { name: 'React', category: 'Frontend Web' },
      { name: 'Node.js', category: 'Backend Web' },
      { name: 'Express', category: 'Backend Web' },
      { name: 'MongoDB', category: 'Database' },
      { name: 'SQL', category: 'Database' },
      { name: 'HTML', category: 'Frontend Web' },
      { name: 'CSS', category: 'Frontend Web' },
      { name: 'Machine Learning', category: 'AI & Data' },
      { name: 'Deep Learning', category: 'AI & Data' },
      { name: 'NLP', category: 'AI & Data' },
      { name: 'Computer Vision', category: 'AI & Data' },
      { name: 'Data Science', category: 'AI & Data' },
      { name: 'UI/UX', category: 'Design' },
      { name: 'Flutter', category: 'Mobile' },
      { name: 'Android', category: 'Mobile' },
      { name: 'Cloud', category: 'DevOps & Infrastructure' },
      { name: 'DevOps', category: 'DevOps & Infrastructure' },
      { name: 'Git', category: 'Version Control' },
      { name: 'GitHub', category: 'Version Control' },
      { name: 'Blockchain', category: 'Security & Web3' },
      { name: 'Docker', category: 'DevOps & Infrastructure' },
      { name: 'Kubernetes', category: 'DevOps & Infrastructure' },
      { name: 'Cybersecurity', category: 'Security' }
    ];
    await Skill.insertMany(skillsList);
    console.log(`Seeded ${skillsList.length} master skills.`);

    // 2. Seed Expanded Users (10 Students + 5 Guides + Admin)
    const usersToCreate = [
      {
        name: 'Rahul Kumar (Student A)',
        email: 'student1@college.edu',
        password: 'password123',
        role: 'student',
        college: 'National Institute of Technology',
        department: 'Computer Science & Engineering',
        year: '4th Year',
        bio: 'Passionate MERN developer interested in building AI-powered web applications.',
        skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
        interests: ['Web Development', 'Artificial Intelligence', 'Cloud'],
        githubUsername: 'rahulkumar-dev'
      },
      {
        name: 'Priya Sharma (Student B)',
        email: 'student2@college.edu',
        password: 'password123',
        role: 'student',
        college: 'National Institute of Technology',
        department: 'Computer Science & Engineering',
        year: '4th Year',
        bio: 'Fullstack developer & Python enthusiast with ML background.',
        skills: ['React', 'Node.js', 'MongoDB', 'Python'],
        interests: ['Artificial Intelligence', 'Full Stack Development'],
        githubUsername: 'priyasharma-code'
      },
      {
        name: 'Amit Patel (Student C)',
        email: 'student3@college.edu',
        password: 'password123',
        role: 'student',
        college: 'National Institute of Technology',
        department: 'Information Technology',
        year: '4th Year',
        bio: 'Backend specialist proficient in Java, Spring Boot and SQL databases.',
        skills: ['Java', 'SQL', 'C++', 'Machine Learning'],
        interests: ['Backend Engineering', 'Distributed Systems'],
        githubUsername: 'amitpatel-tech'
      },
      {
        name: 'Neha Verma (Student D)',
        email: 'student4@college.edu',
        password: 'password123',
        role: 'student',
        college: 'National Institute of Technology',
        department: 'Computer Science & Engineering',
        year: '3rd Year',
        bio: 'UI/UX designer and frontend developer.',
        skills: ['React', 'UI/UX', 'JavaScript', 'HTML', 'CSS'],
        interests: ['Frontend Engineering', 'User Experience Design'],
        githubUsername: 'nehaverma-design'
      },
      {
        name: 'Vikram Singh (Student E)',
        email: 'student5@college.edu',
        password: 'password123',
        role: 'student',
        college: 'National Institute of Technology',
        department: 'Artificial Intelligence & Data Science',
        year: '4th Year',
        bio: 'Data Scientist specializing in Natural Language Processing & Computer Vision.',
        skills: ['Python', 'Data Science', 'NLP', 'Machine Learning', 'MongoDB'],
        interests: ['Natural Language Processing', 'Deep Learning'],
        githubUsername: 'vikram-ds'
      },
      {
        name: 'Sneha Reddy (Student F)',
        email: 'student6@college.edu',
        password: 'password123',
        role: 'student',
        college: 'National Institute of Technology',
        department: 'Information Technology',
        year: '4th Year',
        bio: 'Frontend engineer with TypeScript & UI/UX specialization.',
        skills: ['React', 'TypeScript', 'JavaScript', 'UI/UX', 'HTML'],
        interests: ['Frontend Development', 'Web Design'],
        githubUsername: 'snehareddy-dev'
      },
      {
        name: 'Rohan Mehta (Student G)',
        email: 'student7@college.edu',
        password: 'password123',
        role: 'student',
        college: 'National Institute of Technology',
        department: 'Electronics & Communication',
        year: '4th Year',
        bio: 'Embedded systems engineer passionate about IoT sensor networks & Computer Vision.',
        skills: ['C++', 'Python', 'Computer Vision', 'C', 'Node.js'],
        interests: ['IoT', 'Robotics', 'Embedded Systems'],
        githubUsername: 'rohanm-iot'
      },
      {
        name: 'Ananya Gupta (Student H)',
        email: 'student8@college.edu',
        password: 'password123',
        role: 'student',
        college: 'National Institute of Technology',
        department: 'Computer Science & Engineering',
        year: '3rd Year',
        bio: 'Mobile app developer specializing in Flutter & Android cross-platform frameworks.',
        skills: ['Flutter', 'Android', 'Java', 'UI/UX', 'Git'],
        interests: ['Mobile Applications', 'UI Design'],
        githubUsername: 'ananya-mobile'
      },
      {
        name: 'Karthik Nair (Student I)',
        email: 'student9@college.edu',
        password: 'password123',
        role: 'student',
        college: 'National Institute of Technology',
        department: 'Artificial Intelligence & Data Science',
        year: '4th Year',
        bio: 'Deep Learning researcher working on Computer Vision and Autonomous Navigation models.',
        skills: ['Python', 'Deep Learning', 'Computer Vision', 'Data Science', 'C++'],
        interests: ['Computer Vision', 'Autonomous Robotics'],
        githubUsername: 'karthik-ai'
      },
      {
        name: 'Divya Krishna (Student J)',
        email: 'student10@college.edu',
        password: 'password123',
        role: 'student',
        college: 'National Institute of Technology',
        department: 'Computer Science & Engineering',
        year: '4th Year',
        bio: 'Cloud DevOps practitioner specializing in Docker containerization & AWS infrastructure.',
        skills: ['Cloud', 'DevOps', 'Docker', 'Kubernetes', 'Python', 'SQL'],
        interests: ['Cloud Architecture', 'DevOps Automation'],
        githubUsername: 'divya-devops'
      },

      // Faculty Guides
      {
        name: 'Dr. Suresh Kumar',
        email: 'guide1@college.edu',
        password: 'password123',
        role: 'guide',
        college: 'National Institute of Technology',
        department: 'Computer Science & Engineering',
        year: 'Faculty',
        bio: 'Professor & Head of AI Research Lab. 15+ years academic & industry research experience in NLP and ML.',
        skills: ['Machine Learning', 'Deep Learning', 'Python', 'NLP', 'Data Science'],
        interests: ['AI Research', 'Natural Language Processing']
      },
      {
        name: 'Prof. Anitha Rao',
        email: 'guide2@college.edu',
        password: 'password123',
        role: 'guide',
        college: 'National Institute of Technology',
        department: 'Computer Science & Engineering',
        year: 'Faculty',
        bio: 'Associate Professor specializing in Cloud Computing, DevOps & Distributed Web Systems.',
        skills: ['React', 'Node.js', 'Cloud', 'DevOps', 'MongoDB', 'SQL'],
        interests: ['Cloud Architecture', 'Web Technologies']
      },
      {
        name: 'Dr. Rajesh Sharma',
        email: 'guide3@college.edu',
        password: 'password123',
        role: 'guide',
        college: 'National Institute of Technology',
        department: 'Information Technology',
        year: 'Faculty',
        bio: 'Professor & Head of Information Security Division. Research focused on Blockchain & Cryptography.',
        skills: ['Blockchain', 'Cybersecurity', 'SQL', 'Python', 'DevOps'],
        interests: ['Cybersecurity', 'Blockchain']
      },
      {
        name: 'Dr. Meenakshi Sundaram',
        email: 'guide4@college.edu',
        password: 'password123',
        role: 'guide',
        college: 'National Institute of Technology',
        department: 'Electronics & Communication',
        year: 'Faculty',
        bio: 'Professor of Embedded Systems. Specialist in IoT architectures, smart sensors, and Robotics.',
        skills: ['C++', 'Python', 'Computer Vision', 'C', 'Cloud'],
        interests: ['IoT', 'Robotics']
      },
      {
        name: 'Prof. Vikramaditya Sen',
        email: 'guide5@college.edu',
        password: 'password123',
        role: 'guide',
        college: 'National Institute of Technology',
        department: 'Artificial Intelligence & Data Science',
        year: 'Faculty',
        bio: 'Associate Professor in Computer Vision & Neural Networks. Author of 25+ IEEE research papers.',
        skills: ['Computer Vision', 'Deep Learning', 'Python', 'Machine Learning'],
        interests: ['Computer Vision', 'Deep Learning']
      },

      // Admin Account
      {
        name: 'System Admin',
        email: 'admin@college.edu',
        password: 'admin123',
        role: 'admin',
        college: 'National Institute of Technology',
        department: 'Admin Division',
        year: 'Admin',
        bio: 'Platform administrator for ProjectMate college portal.',
        skills: ['Management', 'DevOps', 'Security']
      }
    ];

    const createdUsers = [];
    for (const u of usersToCreate) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`Seeded ${createdUsers.length} total users.`);

    const studentA = createdUsers[0];
    const studentB = createdUsers[1];
    const studentC = createdUsers[2];
    const studentD = createdUsers[3];
    const studentE = createdUsers[4];
    const studentF = createdUsers[5];
    const studentG = createdUsers[6];
    const studentH = createdUsers[7];
    const studentI = createdUsers[8];
    const studentJ = createdUsers[9];

    const guideSuresh = createdUsers[10];
    const guideAnitha = createdUsers[11];
    const guideRajesh = createdUsers[12];
    const guideMeenakshi = createdUsers[13];
    const guideVikramaditya = createdUsers[14];

    // 3. Seed Expanded Project Ideas
    const ideasToCreate = [
      {
        title: 'AI-Based Resume Analyzer & Job Matching System',
        description: 'An intelligent platform that extracts key skills from candidate resumes using NLP models, compares them with job requirement descriptions, and ranks candidates with a match score.',
        domain: 'Artificial Intelligence',
        difficulty: 'Advanced',
        requiredSkills: ['React', 'Node.js', 'MongoDB', 'Python', 'NLP'],
        teamSize: 4,
        tags: ['AI', 'NLP', 'MERN', 'Resume Analysis'],
        createdBy: guideSuresh._id
      },
      {
        title: 'Smart Campus IoT Energy & Environment Monitor',
        description: 'Real-time dashboard monitoring energy consumption, HVAC usage, room occupancy, and environmental metrics across college campus using IoT sensors and WebSocket alerts.',
        domain: 'IoT & Embedded',
        difficulty: 'Intermediate',
        requiredSkills: ['C++', 'Python', 'React', 'Node.js', 'SQL'],
        teamSize: 4,
        tags: ['IoT', 'Sensors', 'Real-time', 'Dashboard'],
        createdBy: guideMeenakshi._id
      },
      {
        title: 'Decentralized Academic Certificate Verifier',
        description: 'Blockchain-backed system to issue, store, and instantly verify degree certificates using cryptographic hashes, eliminating academic fraud.',
        domain: 'Blockchain',
        difficulty: 'Advanced',
        requiredSkills: ['Blockchain', 'React', 'Node.js', 'Cybersecurity', 'Cloud'],
        teamSize: 3,
        tags: ['Blockchain', 'Security', 'Verification'],
        createdBy: guideRajesh._id
      },
      {
        title: 'Automated Code Review & Plagiarism Checker for Assignments',
        description: 'Static analysis platform for programming lab submissions that detects code similarity, style violations, and test case pass rates automatically.',
        domain: 'Web Development',
        difficulty: 'Intermediate',
        requiredSkills: ['Python', 'Java', 'React', 'Node.js', 'Docker'],
        teamSize: 4,
        tags: ['Code Review', 'Plagiarism', 'Education'],
        createdBy: guideSuresh._id
      },
      {
        title: 'Cross-Platform Mobile Healthcare & Telemedicine App',
        description: 'Flutter-based telemedicine mobile application providing remote doctor consultation booking, prescription storage, and real-time vital stats tracking.',
        domain: 'Mobile Development',
        difficulty: 'Intermediate',
        requiredSkills: ['Flutter', 'Android', 'Node.js', 'MongoDB', 'UI/UX'],
        teamSize: 3,
        tags: ['Flutter', 'Mobile', 'Healthcare'],
        createdBy: studentH._id
      },
      {
        title: 'Autonomous Drone Obstacle Avoidance using Computer Vision',
        description: 'Edge AI processing application running YOLO / OpenCV models on Raspberry Pi / Jetson Nano to steer micro-drones around obstacles in real time.',
        domain: 'Artificial Intelligence',
        difficulty: 'Advanced',
        requiredSkills: ['Python', 'Computer Vision', 'Deep Learning', 'C++'],
        teamSize: 4,
        tags: ['Computer Vision', 'Robotics', 'Deep Learning'],
        createdBy: guideVikramaditya._id
      }
    ];

    await ProjectIdea.insertMany(ideasToCreate);
    console.log(`Seeded ${ideasToCreate.length} project ideas.`);

    // 4. Seed Multiple Active Major Projects

    // Project 1: AI Resume Analyzer (Owner: Student A)
    const project1 = await Project.create({
      title: 'AI Resume Analyzer & Skill Matcher',
      description: 'A comprehensive B.Tech major project providing automated resume parsing, candidate skill extraction using NLP models, and skill match scoring for academic & recruitment workflows.',
      domain: 'Artificial Intelligence',
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'Python', 'NLP'],
      teamSize: 4,
      difficulty: 'Advanced',
      duration: '4 Months',
      preferredGuideSkills: ['Machine Learning', 'NLP', 'Python'],
      owner: studentA._id,
      guide: guideSuresh._id,
      githubRepository: {
        url: 'https://github.com/facebook/react',
        owner: 'facebook',
        repo: 'react'
      },
      status: 'Development',
      progress: 65
    });

    const team1 = await Team.create({
      project: project1._id,
      leader: studentA._id,
      members: [
        { user: studentA._id, role: 'Team Leader & Fullstack Dev' },
        { user: studentB._id, role: 'Backend & ML Engineer' }
      ]
    });
    project1.team = team1._id;
    await project1.save();

    // Project 2: Smart Campus IoT Monitor (Owner: Student G)
    const project2 = await Project.create({
      title: 'Smart Campus IoT Energy & Infrastructure Monitor',
      description: 'IoT sensor network tracking room temperatures, power grid load, and water tank levels with automated SMS alerts.',
      domain: 'IoT & Embedded',
      requiredSkills: ['C++', 'Python', 'React', 'Node.js', 'SQL'],
      teamSize: 4,
      difficulty: 'Intermediate',
      duration: '4 Months',
      preferredGuideSkills: ['IoT', 'C++', 'Embedded Systems'],
      owner: studentG._id,
      guide: guideMeenakshi._id,
      githubRepository: {
        url: 'https://github.com/expressjs/express',
        owner: 'expressjs',
        repo: 'express'
      },
      status: 'Planning',
      progress: 35
    });

    const team2 = await Team.create({
      project: project2._id,
      leader: studentG._id,
      members: [
        { user: studentG._id, role: 'Team Leader & Embedded Engineer' },
        { user: studentF._id, role: 'Frontend & UI Developer' }
      ]
    });
    project2.team = team2._id;
    await project2.save();

    // Project 3: Decentralized Academic Certificate Verifier (Owner: Student C)
    const project3 = await Project.create({
      title: 'Decentralized Academic Certificate Verifier',
      description: 'Cryptographic diploma issuance and instant public verification platform built on blockchain smart contracts.',
      domain: 'Blockchain',
      requiredSkills: ['Blockchain', 'React', 'Node.js', 'Cybersecurity', 'Cloud'],
      teamSize: 3,
      difficulty: 'Advanced',
      duration: '5 Months',
      preferredGuideSkills: ['Blockchain', 'Cybersecurity'],
      owner: studentC._id,
      guide: guideRajesh._id,
      githubRepository: {
        url: 'https://github.com/nodejs/node',
        owner: 'nodejs',
        repo: 'node'
      },
      status: 'Development',
      progress: 50
    });

    const team3 = await Team.create({
      project: project3._id,
      leader: studentC._id,
      members: [
        { user: studentC._id, role: 'Team Leader & Smart Contract Engineer' },
        { user: studentJ._id, role: 'Cloud & DevOps Specialist' }
      ]
    });
    project3.team = team3._id;
    await project3.save();

    console.log(`Seeded 3 active major projects with initialized teams.`);

    // 5. Seed Tasks across Projects
    const tasksToCreate = [
      // Tasks for Project 1
      {
        project: project1._id,
        title: 'Setup MERN Stack Architecture & MongoDB Schemas',
        description: 'Initialize Express server, setup mongoose models for Users, Projects, Teams, Tasks.',
        assignedTo: studentA._id,
        assignedBy: studentA._id,
        priority: 'High',
        status: 'Completed',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        project: project1._id,
        title: 'Implement Transparent Teammate Skill Matching Algorithm',
        description: 'Build matching logic calculating skill match percentage: (Matched skills / Required skills) * 100.',
        assignedTo: studentA._id,
        assignedBy: studentA._id,
        priority: 'High',
        status: 'Completed',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        project: project1._id,
        title: 'Develop NLP Model for Skill Extraction from Resumes',
        description: 'Train Spacy / Transformers model to identify key tech keywords from PDF/DOCX resumes.',
        assignedTo: studentB._id,
        assignedBy: studentA._id,
        priority: 'High',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        project: project1._id,
        title: 'Integrate GitHub REST API Metrics Dashboard',
        description: 'Fetch repository stars, forks, languages, and commit timeline for progress tracking.',
        assignedTo: studentA._id,
        assignedBy: studentA._id,
        priority: 'Medium',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      },

      // Tasks for Project 2 (IoT Monitor)
      {
        project: project2._id,
        title: 'Configure ESP32 Temperature & Humidity Sensors',
        description: 'Wire DHT22 sensors and flash C++ firmware with Wi-Fi telemetry broadcasting.',
        assignedTo: studentG._id,
        assignedBy: studentG._id,
        priority: 'High',
        status: 'Completed',
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        project: project2._id,
        title: 'Design Real-Time React Dashboard UI for Campus Map',
        description: 'Build dynamic SVG map rendering sensor node statuses in real-time.',
        assignedTo: studentF._id,
        assignedBy: studentG._id,
        priority: 'High',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      },

      // Tasks for Project 3 (Blockchain Verifier)
      {
        project: project3._id,
        title: 'Write Certificate Issuer Solidity Smart Contract',
        description: 'Implement diploma hashing function and authorization roles.',
        assignedTo: studentC._id,
        assignedBy: studentC._id,
        priority: 'High',
        status: 'Completed',
        dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        project: project3._id,
        title: 'Deploy Dockerized Verifier Nodes to AWS Cloud',
        description: 'Configure automated CI/CD pipeline using GitHub Actions.',
        assignedTo: studentJ._id,
        assignedBy: studentC._id,
        priority: 'Medium',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)
      }
    ];

    await Task.insertMany(tasksToCreate);
    console.log(`Seeded ${tasksToCreate.length} project tasks.`);

    // 6. Seed Milestones across Projects
    const milestonesToCreate = [
      // Milestones for Project 1
      {
        project: project1._id,
        title: 'Project Synopsis & Requirement Specification',
        description: 'Formulation of project scope, domain selection, and skill requirements.',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        status: 'Completed',
        progress: 100
      },
      {
        project: project1._id,
        title: 'System Design & Teammate Formation',
        description: 'Skill-based candidate evaluation, team recruitment, and guide assignment.',
        startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        status: 'Completed',
        progress: 100
      },
      {
        project: project1._id,
        title: 'Core Development Phase 1 (Matching & API)',
        description: 'Implementation of smart skill matching engine, user dashboards, and task board.',
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: 'In Progress',
        progress: 70
      },

      // Milestones for Project 2
      {
        project: project2._id,
        title: 'IoT Sensor Calibration & Hardware Testing',
        description: 'Calibrate sensor nodes and verify WebSocket telemetry.',
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'Completed',
        progress: 100
      },
      {
        project: project2._id,
        title: 'Web Control Dashboard & SMS Gateway Integration',
        description: 'Connect React dashboard with Twilio SMS notification alerts.',
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        status: 'In Progress',
        progress: 40
      }
    ];

    await Milestone.insertMany(milestonesToCreate);
    console.log(`Seeded ${milestonesToCreate.length} project milestones.`);

    // 7. Seed Team Requests & Guide Requests
    await TeamRequest.create({
      sender: studentA._id,
      receiver: studentB._id,
      project: project1._id,
      message: 'Hi Priya! Your profile matches 80% of our required skills for AI Resume Analyzer. Would love to have you on the team!',
      status: 'Accepted'
    });

    await TeamRequest.create({
      sender: studentA._id,
      receiver: studentE._id,
      project: project1._id,
      message: 'Hi Vikram! We noticed your strong NLP expertise. Care to join our team for AI Resume Analyzer?',
      status: 'Pending'
    });

    await TeamRequest.create({
      sender: studentG._id,
      receiver: studentF._id,
      project: project2._id,
      message: 'Hi Sneha! We need your React and UI/UX skills for our IoT Campus Monitor project dashboard.',
      status: 'Accepted'
    });

    await GuideRequest.create({
      project: project1._id,
      team: team1._id,
      student: studentA._id,
      guide: guideSuresh._id,
      message: 'Respected Dr. Suresh, our team is developing an AI Resume Analyzer. We request your expert guidance in NLP and ML modeling.',
      status: 'Accepted'
    });

    await GuideRequest.create({
      project: project2._id,
      team: team2._id,
      student: studentG._id,
      guide: guideMeenakshi._id,
      message: 'Respected Dr. Meenakshi, we request your guidance for our Smart Campus IoT Monitor project.',
      status: 'Accepted'
    });

    // 8. Seed Sample Notifications
    await Notification.create({
      recipient: studentA._id,
      sender: studentB._id,
      title: 'Team Request Accepted',
      message: 'Priya Sharma accepted your team request for "AI Resume Analyzer & Skill Matcher"',
      type: 'TEAM_REQUEST',
      isRead: true
    });

    await Notification.create({
      recipient: studentA._id,
      sender: guideSuresh._id,
      title: 'Guide Request Accepted',
      message: 'Dr. Suresh Kumar accepted to be the Faculty Guide for "AI Resume Analyzer & Skill Matcher"',
      type: 'GUIDE_REQUEST',
      isRead: false
    });

    console.log('\n======================================================');
    console.log('SUCCESS: Expanded Database seeded successfully!');
    console.log('======================================================\n');
    console.log('EXPANDED DEMO ACCOUNTS LIST:');
    console.log('1. Student A (Leader - AI Resume Analyzer): student1@college.edu / password123');
    console.log('2. Student B (Matched Teammate - 80%): student2@college.edu / password123');
    console.log('3. Student E (NLP Candidate): student5@college.edu / password123');
    console.log('4. Student F (Frontend Dev - IT): student6@college.edu / password123');
    console.log('5. Student G (Leader - IoT Project): student7@college.edu / password123');
    console.log('6. Student H (Mobile Dev): student8@college.edu / password123');
    console.log('7. Student I (Deep Learning): student9@college.edu / password123');
    console.log('8. Student J (DevOps Specialist): student10@college.edu / password123');
    console.log('9. Faculty Guide (AI/ML): guide1@college.edu / password123 (Dr. Suresh)');
    console.log('10. Faculty Guide (IoT): guide4@college.edu / password123 (Dr. Meenakshi)');
    console.log('11. Faculty Guide (Blockchain): guide3@college.edu / password123 (Dr. Rajesh)');
    console.log('12. Admin: admin@college.edu / admin123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
