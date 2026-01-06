import { ExternalLink, Github } from 'lucide-react';

interface Project {
  name: string;
  description: string;
  tech: string[];
  link?: string;
  github?: string;
}

const projects: Project[] = [
  {
    name: 'cursi.ng',
    description: 'Personal portfolio with Discord integration and music player',
    tech: ['React', 'TypeScript', 'Tailwind'],
    link: 'https://cursi.ng',
  },
  {
    name: 'api wrapper',
    description: 'A lightweight wrapper for common API interactions',
    tech: ['Node.js', 'TypeScript'],
    github: '#',
  },
  {
    name: 'discord bot',
    description: 'Multi-purpose bot with moderation and utility features',
    tech: ['Discord.js', 'Node.js'],
    github: '#',
  },
];

const ProjectsTab = () => {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground mb-3">
        a collection of things i've worked on
      </p>
      {projects.map((project, index) => (
        <div key={index} className="content-section">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="text-xs font-medium text-foreground/90">{project.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{project.description}</p>
              <div className="flex gap-1.5 mt-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-1">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink size={12} />
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsTab;
