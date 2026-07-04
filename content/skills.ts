export type SkillCategory = {
  /** Styling hook: the stylesheet themes each column via `skills__<type>`. */
  type: "frontend" | "backend" | "other";
  title: string;
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    type: "frontend",
    title: "Frontend",
    skills: [
      "HTML5 & CSS3",
      "JavaScript (ES5 /ES6+)",
      "React & NextJS",
      "Sass & Bootstrap",
      "jQuery & Pug",
    ],
  },
  {
    type: "backend",
    title: "Backend",
    skills: ["NodeJS & Express", "MySQL", "MongoDB"],
  },
  {
    type: "other",
    title: "Tools & Workflows",
    skills: [
      "Git & Github",
      "Agile, Trello, Social Coding",
      "VS Code",
      "Webpack & Snowpack",
    ],
  },
];
