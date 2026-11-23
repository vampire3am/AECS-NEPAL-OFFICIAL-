export const business = {
  name: "Abroad Education Consultancy Services Pvt. Ltd.",
  phone: "+977 970-451-8337",
  tel: "+9779704518337",
  email: "info@aecsnepal.com",
  address: "Adwait Marga, Purano Buspark, Bagbazar, Kathmandu",
  hours: "Sunday–Friday 06:30–19:00 · Saturday 08:00–14:00",
  whatsapp: "https://wa.me/9779704518337",
  map: "https://maps.app.goo.gl/UjLWJpuLMvZbQV4JA",
};
export const reviewed = "23 November 2026";
export type Destination = {
  slug: string;
  name: string;
  region: "Asia Pacific" | "Europe" | "North America";
  image: string;
  intro: string;
  focus: string;
  language: string;
  questions: string[];
};
export const destinations: Destination[] = [
  {
    slug: "australia",
    name: "Australia",
    region: "Asia Pacific",
    image: "/images/australia.webp",
    intro:
      "A broad choice of universities, practical courses and city experiences.",
    focus: "Course fit and a complete study budget",
    language: "English",
    questions: [
      "Which course builds on your previous study?",
      "What is your budget for tuition, living costs and required cover?",
      "Which institution and campus suit your priorities?",
    ],
  },
  {
    slug: "uk",
    name: "United Kingdom",
    region: "Europe",
    image: "/images/uk.webp",
    intro:
      "Explore focused degrees, established universities and a wide range of subjects.",
    focus: "Degree structure and institution choice",
    language: "English",
    questions: [
      "How does the degree fit your academic background?",
      "What does the full course cost, including living expenses?",
      "Which English evidence does your chosen course accept?",
    ],
  },
  {
    slug: "canada",
    name: "Canada",
    region: "North America",
    image: "/images/canada.webp",
    intro:
      "Compare institutions, course structures and the practicalities of your chosen province.",
    focus: "Institution, programme and provincial context",
    language: "Course-specific",
    questions: [
      "Is the institution and programme appropriate for your goal?",
      "What are the current requirements for your specific application?",
      "Have you budgeted for location, weather and housing?",
    ],
  },
  {
    slug: "germany",
    name: "Germany",
    region: "Europe",
    image: "/images/germany.webp",
    intro:
      "Find a route through public and private institutions, with language preparation in view.",
    focus: "Academic recognition and language readiness",
    language: "German or English, by course",
    questions: [
      "Is your qualification recognized for direct admission?",
      "Does your course need German, English or both?",
      "What documentation and financial evidence will your route require?",
    ],
  },
  {
    slug: "usa",
    name: "United States",
    region: "North America",
    image: "/images/usa.webp",
    intro:
      "Explore a wide institution landscape, subject specialisms and research-led routes.",
    focus: "University shortlist and application preparation",
    language: "English",
    questions: [
      "What academic environment suits your subject?",
      "Which costs are funded and which remain yours?",
      "What does each institution ask for in the application?",
    ],
  },
  {
    slug: "new-zealand",
    name: "New Zealand",
    region: "Asia Pacific",
    image: "/images/new-zealand.webp",
    intro:
      "Consider university and applied-study options alongside location and lifestyle.",
    focus: "Qualification choice and a realistic timeline",
    language: "English",
    questions: [
      "Which qualification supports your next academic step?",
      "What is the complete budget for the course?",
      "When must your application and documents be ready?",
    ],
  },
  {
    slug: "finland",
    name: "Finland",
    region: "Europe",
    image: "/images/finland.webp",
    intro:
      "Explore university and applied-sciences pathways with course-specific entry requirements.",
    focus: "Programme selection and application windows",
    language: "Course-specific",
    questions: [
      "What selection process does the programme use?",
      "Are scholarships available for your exact course?",
      "Which language requirements apply?",
    ],
  },
  {
    slug: "japan",
    name: "Japan",
    region: "Asia Pacific",
    image: "/images/japan.webp",
    intro: "Plan language preparation and academic progression together.",
    focus: "Language readiness and a clear study route",
    language: "Japanese or English, by route",
    questions: [
      "What Japanese proficiency will your route require?",
      "What progression is available after language study?",
      "What costs and evidence should be prepared?",
    ],
  },
  {
    slug: "south-korea",
    name: "South Korea",
    region: "Asia Pacific",
    image: "/images/south-korea.webp",
    intro:
      "Investigate language, university and subject options with a counsellor.",
    focus: "Course language and academic fit",
    language: "Korean or English, by course",
    questions: [
      "Which language is used in your chosen programme?",
      "What preparation is needed before starting?",
      "What are the institution’s current entry requirements?",
    ],
  },
  {
    slug: "hungary",
    name: "Hungary",
    region: "Europe",
    image: "/images/hungary.webp",
    intro:
      "Explore European degree programmes and institution-specific funding opportunities.",
    focus: "Course comparison and funding conditions",
    language: "Course-specific",
    questions: [
      "Which course matches your academic background?",
      "What does any scholarship actually cover?",
      "Which living and study costs remain your responsibility?",
    ],
  },
  {
    slug: "malta",
    name: "Malta",
    region: "Europe",
    image: "/images/malta.webp",
    intro:
      "Discuss institution choice, qualification recognition and study expectations.",
    focus: "Accreditation and programme outcomes",
    language: "Course-specific",
    questions: [
      "Is the qualification recognized for your intended next step?",
      "What are the total costs and refund conditions?",
      "Which current application requirements apply?",
    ],
  },
  {
    slug: "cyprus",
    name: "Cyprus",
    region: "Europe",
    image: "/images/cyprus.webp",
    intro:
      "Compare institutions carefully, including location and qualification recognition.",
    focus: "Institution verification and location",
    language: "Course-specific",
    questions: [
      "Where exactly is your institution based?",
      "How is the qualification recognized?",
      "What does the full offer include and exclude?",
    ],
  },
];
export const packages = [
  {
    name: "IELTS Computer-Delivered",
    price: 33000,
    group: "IELTS",
    description: "Academic & General Training",
    items: [
      "Booking assistance through the AECS desk",
      "One full-length mock test",
      "Free initial counselling",
    ],
  },
  {
    name: "IELTS Paper-Based",
    price: 33000,
    group: "IELTS",
    description: "Paper-based preparation and booking",
    items: [
      "Paper-based mock practice",
      "Writing review and speaking practice",
      "Booking coordination",
    ],
  },
  {
    name: "PTE Academic",
    price: 29000,
    group: "PTE",
    description: "Pearson English test pathway",
    items: [
      "Exam-simulation lab access",
      "Booking and score-send guidance",
      "Format-focused preparation",
    ],
  },
  {
    name: "PTE Core",
    price: 29000,
    group: "PTE",
    description: "A separate test for specific routes",
    items: [
      "PTE Core format walk-through",
      "Mock practice in the lab",
      "Booking assistance",
    ],
  },
  {
    name: "Duolingo English Test",
    price: 7500,
    group: "Duolingo",
    description: "Online-proctored test preparation",
    items: [
      "ID and equipment checklist",
      "Question-format practice",
      "Booking and score-send guidance",
    ],
  },
  {
    name: "Single mock test",
    price: 500,
    group: "Mock tests",
    description: "One full-length practice sitting",
    items: [
      "Exam-format timing",
      "Diagnostic feedback",
      "Faculty review session",
    ],
  },
  {
    name: "Three mock tests",
    price: 1500,
    group: "Mock tests",
    description: "Practice, review and check progress",
    items: [
      "Three full-length mocks",
      "Comparative score tracking",
      "Speaking practice feedback",
    ],
  },
  {
    name: "Five mock tests",
    price: 2500,
    group: "Mock tests",
    description: "A longer practice cycle",
    items: [
      "Five full-length mocks",
      "Diagnostic reviews",
      "Practice for weaker sections",
    ],
  },
];
export const team = [
  {
    name: "Arun Upadhyaya",
    role: "Founder & Managing Director",
    image: "/images/arun.webp",
    text: "Academic leadership and senior study-abroad counselling. AECS lists Pearson Level 2 PTE, British Council and TITI training credentials.",
  },
  {
    name: "Kamala Baidhya",
    role: "Chief Executive Officer",
    image: "/images/kamala.webp",
    text: "Leads operations, institutional relationships and the day-to-day work of the Bagbazar centre.",
  },
  {
    name: "Madan Khanal",
    role: "PTE / Duolingo Instructor",
    image: "/images/madan.webp",
    text: "Supports students with timed practice, task strategy and feedback for PTE Academic and the Duolingo English Test.",
  },
  {
    name: "Sashita Thapa Magar",
    role: "German Counsellor",
    image: "/images/sashita.webp",
    text: "Helps students understand language preparation, university options and documentation for their Germany study route.",
  },
];
export const guides = [
  {
    slug: "choosing-your-english-test",
    title: "IELTS, PTE or Duolingo?",
    description:
      "Start with acceptance, then consider the format that suits you.",
    category: "English preparation",
    sections: [
      {
        title: "Check your actual shortlist first",
        text: "Ask each institution which tests and versions it accepts for your specific programme. Admission requirements and visa requirements may differ. Keep the institution’s written answer with your application notes.",
      },
      {
        title: "Try the format before committing",
        text: "A timed practice session can show whether keyboard work, microphone responses or paper-based writing feel manageable. Use feedback across all skills, rather than choosing a test because somebody calls it easy.",
      },
      {
        title: "Plan the whole timetable",
        text: "Allow time for preparation, an available test date, results and any further attempt you might need. Ask the AECS exam desk to confirm the current fee and booking conditions before paying.",
      },
    ],
  },
  {
    slug: "building-a-study-budget",
    title: "Build a budget your family can discuss.",
    description:
      "Separate the costs you know from the estimates you still need.",
    category: "Planning",
    sections: [
      {
        title: "List the full course costs",
        text: "Record tuition from the institution’s current written fee schedule. Separate deposits from the total payable. Add required cover, application charges and any compulsory course equipment.",
      },
      {
        title: "Make living costs visible",
        text: "Housing, utilities, food, transport and initial setup deserve separate lines. Mark every estimate with its source, currency and date. Ask what changes if exchange rates or accommodation costs move.",
      },
      {
        title: "Keep assumptions honest",
        text: "Do not rely on an unconfirmed scholarship or future employment to make a budget balance. Ask your family and counsellor which funds are available, what evidence is needed and what contingency is realistic.",
      },
    ],
  },
  {
    slug: "your-first-counselling-session",
    title: "Make the first conversation useful.",
    description:
      "Bring your questions. A perfect application file can come later.",
    category: "Counselling",
    sections: [
      {
        title: "Bring what you already know",
        text: "Your latest qualification, subject interests, intended intake and approximate budget are a useful starting point. An English score helps if you already have one; you can still ask questions without it.",
      },
      {
        title: "Ask for the reasoning",
        text: "Ask why a course or destination suits your background, what alternatives were considered and which assumptions need checking. Request a written cost breakdown and clear next steps.",
      },
      {
        title: "Leave with a next action",
        text: "Agree who will check course requirements, what you need to prepare and when to speak again. An initial conversation should make your options clearer without pressuring you to decide immediately.",
      },
    ],
  },
];
export const money = (value: number) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(value);

