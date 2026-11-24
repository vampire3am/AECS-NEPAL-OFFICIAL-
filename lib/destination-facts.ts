export type DestinationFacts = {
  tuition: string;
  living: string;
  intakes: string;
  sources: { label: string; url: string }[];
};
export const factsReviewed = "24 November 2026";
export const destinationFacts: Record<string, DestinationFacts> = {
  australia: {
    tuition:
      "Course-specific. Compare the provider’s published annual fee and additional course costs.",
    living:
      "Use Study Australia’s city and accommodation calculator. Its estimates were last updated in November 2023; obtain current housing quotes.",
    intakes:
      "University semesters commonly start February/March and July; availability depends on the course.",
    sources: [
      {
        label: "Study Australia: costs",
        url: "https://www.studyaustralia.gov.au/en/life-in-australia/living-and-education-costs",
      },
      {
        label: "Study Australia: mid-year entry",
        url: "https://www.studyaustralia.gov.au/en/tools-and-resources/tips-and-advice-for-students/understanding-mid-year-entry.html",
      },
    ],
  },
  uk: {
    tuition:
      "Indicative international tuition: undergraduate GBP 11,400–38,000; postgraduate GBP 9,000–30,000. Confirm the fee period and total course fee with your university.",
    living:
      "British Council guide: GBP 1,300–1,400/month in London, GBP 900–1,300/month elsewhere, for a student without dependants.",
    intakes:
      "The standard academic year starts in September/October. Other starts are course-specific.",
    sources: [
      {
        label: "British Council: study and living costs",
        url: "https://study-uk.britishcouncil.org/moving-uk/cost-studying",
      },
      {
        label: "British Council: academic year",
        url: "https://study-uk.britishcouncil.org/plan-studies/choosing-course/modules-courses",
      },
    ],
  },
  canada: {
    tuition:
      "2025/26 national university averages: CAD 41,746/year undergraduate; CAD 24,028/year graduate. These are averages, not a quote for your programme.",
    living:
      "EduCanada suggests at least CAD 23,000/year before tuition, with more for accompanying family. This planning guide is not the current immigration proof-of-funds amount.",
    intakes:
      "Check the programme’s published start dates and international application deadline before choosing an intake.",
    sources: [
      {
        label: "EduCanada: study costs",
        url: "https://www.educanada.ca/programs-programmes/education_cost-cout_education.aspx?lang=eng",
      },
      {
        label: "Statistics Canada: 2025/26 tuition",
        url: "https://www150.statcan.gc.ca/n1/daily-quotidien/250910/dq250910d-eng.htm",
      },
    ],
  },
  germany: {
    tuition:
      "Many state bachelor’s and master’s programmes have no tuition, but semester contributions apply. Non-EU fees and other exceptions apply, including in Baden-Württemberg and some Bavarian institutions.",
    living:
      "DAAD planning estimate: EUR 900–1,200/month. Semester contributions are separate and vary by institution.",
    intakes:
      "University semesters often begin in October and April. Programme openings and international deadlines vary.",
    sources: [
      {
        label: "DAAD: education and living costs",
        url: "https://www.daad.de/en/studying-in-germany/living-in-germany/finances/",
      },
      {
        label: "DAAD: study and application FAQ",
        url: "https://www.daad.org/en/find-funding/faq/faq-on-study-life-research-in-germany/",
      },
    ],
  },
  usa: {
    tuition:
      "Request the institution’s published international cost of attendance. Separate tuition, mandatory fees and the full degree duration.",
    living:
      "Use the institution’s own housing, meals, insurance and personal-expense budget for your campus.",
    intakes:
      "Confirm the specific programme’s admission calendar; an academic term is not an application deadline.",
    sources: [
      {
        label: "EducationUSA: finance your studies",
        url: "https://educationusa.state.gov/your-5-steps-us-study/finance-your-studies",
      },
    ],
  },
  "new-zealand": {
    tuition:
      "Bachelor’s degree guide: NZD 35,000–55,000/year, with higher-cost subjects excluded. The official source labels this range March 2025.",
    living:
      "Ask your provider for current accommodation and everyday cost estimates. Visa financial evidence and actual living costs are different measures.",
    intakes:
      "Use the provider’s course start dates and application calendar; not every course accepts every term.",
    sources: [
      {
        label: "Education New Zealand: tuition and living costs",
        url: "https://www.studywithnewzealand.govt.nz/en/plan-your-studies/cost-of-living",
      },
    ],
  },
  finland: {
    tuition:
      "Usually EUR 9,000–20,000/year for fee-paying non-EU/EEA students on English-taught bachelor’s and master’s programmes. Exemptions and programme exceptions apply.",
    living:
      "Study in Finland recommends EUR 900–1,200/month for living expenses, including accommodation.",
    intakes:
      "Check Studyinfo.fi and the university for the programme’s exact application period and start date.",
    sources: [
      {
        label: "Study in Finland: fees and living costs",
        url: "https://www.studyinfinland.fi/funding-your-studies/fees-and-cost-living",
      },
      {
        label: "Studyinfo: official programme search",
        url: "https://studyinfo.fi/konfo/en/",
      },
    ],
  },
  japan: {
    tuition:
      "Approximate first-year undergraduate admission + tuition averages: JPY 820,000 national; JPY 910,000 local public; JPY 1,300,000 private, excluding medical/dental/pharmaceutical programmes.",
    living:
      "JASSO’s guide gives an average JPY 105,000/month excluding study and research costs. Location and initial housing costs change your total.",
    intakes:
      "Check the school’s application guidelines for the chosen course, language route and start date.",
    sources: [
      {
        label: "JASSO: academic fees",
        url: "https://www.studyinjapan.go.jp/en/planning/academic-fees/",
      },
      {
        label: "JASSO: living costs",
        url: "https://www.studyinjapan.go.jp/en/life/cost-of-living/",
      },
    ],
  },
  "south-korea": {
    tuition:
      "Check the university’s international fee schedule for your subject and degree. Language courses and degree tuition are priced separately.",
    living:
      "Study in Korea estimates KRW 750,000–1,000,000/month for living expenses. Confirm your dormitory, meals and insurance costs.",
    intakes:
      "Confirm admission and TOPIK or English evidence deadlines with the university; language-course calendars can differ.",
    sources: [
      {
        label: "Study in Korea: study expenses",
        url: "https://www.studyinkorea.go.kr/en_US/plan/abroadExpenses.do",
      },
      {
        label: "Study in Korea: living costs",
        url: "https://studyinkorea.go.kr/en/life/livingExpense.do",
      },
    ],
  },
  hungary: {
    tuition:
      "Varies by university and programme, with higher fees for subjects such as medicine. Obtain the current fee schedule before paying.",
    living:
      "European Commission guide: approximately EUR 500–600/month. Housing and city choice may increase your budget.",
    intakes:
      "Ask your institution for its international application calendar and fee-payment deadline.",
    sources: [
      {
        label: "European Commission: studying in Hungary",
        url: "https://education.ec.europa.eu/study-in-europe/country-profiles/hungary",
      },
    ],
  },
  malta: {
    tuition:
      "Non-EU fees depend on the institution and course. Use the institution’s non-EU fee schedule rather than a general average.",
    living:
      "European Commission guide: EUR 900–1,400/month for accommodation, food, utilities, transport and personal costs.",
    intakes:
      "Autumn courses commonly begin in October. Institution-specific application deadlines can fall months earlier.",
    sources: [
      {
        label: "European Commission: studying in Malta",
        url: "https://education.ec.europa.eu/study-in-europe/country-profiles/malta",
      },
      {
        label: "University of Malta: international tuition fees",
        url: "https://www.um.edu.mt/international/students/tuitionfees/",
      },
    ],
  },
  cyprus: {
    tuition:
      "European Commission guide: public-university master’s fees generally EUR 4,100–10,250 per academic year. Bachelor’s and private-university fees need a separate quote.",
    living:
      "Request a current accommodation and living-cost budget from the institution. No country-wide figure is presented here.",
    intakes:
      "Check the recognised institution’s course calendar, language requirements and international application procedure.",
    sources: [
      {
        label: "European Commission: studying in Cyprus",
        url: "https://education.ec.europa.eu/study-in-europe/country-profiles/cyprus",
      },
    ],
  },
};
