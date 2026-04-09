import { skillGroups } from "../../data/narrative";

export function Skills() {
  return (
    <section className="content-section scene scene-skills" id="skills">
      <div className="skills-copy">
        <p className="meta" data-reveal>Skills</p>
        <h2 data-reveal>Things I know.</h2>
        <p data-reveal>
          Tools, languages, and systems I reach for — update this list with your actual stack.
        </p>
      </div>

      <div className="skills-groups">
        {skillGroups.map((group) => (
          <div key={group.label} className="skill-group" data-reveal>
            <p className="skill-group-label">{group.label}</p>
            <div className="skill-tiles">
              {group.skills.map((skill) => (
                <div key={skill} className="skill-tile">
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
