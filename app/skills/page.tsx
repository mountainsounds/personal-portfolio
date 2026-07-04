import type { Metadata } from "next";

import SiteShell from "@/components/site-shell";
import SkillSection from "@/components/skill-section";
import { skillCategories } from "@/content/skills";

export const metadata: Metadata = {
  title: "Skills",
};

export default function SkillsPage() {
  return (
    <SiteShell page="skills">
      <section id="skills">
        {skillCategories.map((category) => (
          <SkillSection key={category.type} category={category} />
        ))}
      </section>
    </SiteShell>
  );
}
