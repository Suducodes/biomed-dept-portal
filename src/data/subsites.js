// The master portal is the department's front door. These are the sibling
// sites it links out to. Edit URLs once you've deployed each sub-site.
export const subsites = [
  {
    name: "BioMed Hub",
    tagline: "Student study library",
    description:
      "Curriculum browser, subject notes, past papers and a biomedical toolbox for every semester of the R2021 syllabus.",
    url: "https://kpriet-bme.github.io/biomed-hub/",
    accent: "#34d399",
    icon: "library",
  },
  {
    name: "BMESI Platform",
    tagline: "Committee workspace",
    description:
      "The BMESI committee's internal hub — task board, events pipeline, journal club and newsletter planning.",
    url: "https://bmesi-platform.vercel.app/",
    accent: "#22d3ee",
    icon: "committee",
  },
];

// Handy external links surfaced across the site.
export const externalLinks = {
  kprExamCell: "https://exam.kpriet.ac.in/",
  results: "https://coe.kpriet.ac.in/",
  college: "https://kpriet.ac.in/",
};
