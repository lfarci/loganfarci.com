export interface Skill {
  name: string;
  yearsOfExperience?: number;
  icon?: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Backend Development",
    skills: [
      { name: ".NET", icon: "/images/skills/backend/dotnet.svg" },
      { name: "C#", icon: "/images/skills/backend/csharp.svg" },
      { name: "ASP.NET" },
      { name: "Entity Framework" },
      { name: "xUnit" },
      { name: "MSTest" },
    ]
  },
  {
    name: "Cloud Computing",
    skills: [
      { name: "Azure App Service", icon: "/images/skills/azure/app-service.svg" },
      { name: "Azure Static Web App", icon: "/images/skills/azure/static-web-apps.svg" },
      { name: "Azure Functions", icon: "/images/skills/azure/function-apps.svg" },
      { name: "Azure Cosmos DB", icon: "/images/skills/azure/cosmos-db.svg" },
      { name: "Azure SQL Database", icon: "/images/skills/azure/sql-database.svg" },
      { name: "Azure Container Registry", icon: "/images/skills/azure/container-registry.svg" },
      { name: "Azure Container Instances", icon: "/images/skills/azure/container-instances.svg" },
      { name: "Azure Blob Storage", icon: "/images/skills/azure/blob-storage.svg" },
      { name: "Azure Communication Services", icon: "/images/skills/azure/communication-services.svg" },
      { name: "Azure Monitor", icon: "/images/skills/azure/monitor.svg" },
      { name: "Azure Key Vault", icon: "/images/skills/azure/key-vault.svg" },
      { name: "Azure API Management", icon: "/images/skills/azure/api-management.svg" },
    ]
  },
  {
    name: "DevOps",
    skills: [
      { name: "Docker" },
      { name: "Kubernetes" },
      { name: "OpenShift" },
      { name: "Terraform" },
      { name: "Bicep" },
      { name: "Linux" },
      { name: "Bash" },
      { name: "PowerShell" },
      { name: "GitHub" },
      { name: "Azure DevOps" },
    ]
  },
  {
    name: "Artificial Intelligence",
    skills: [
      { name: "GitHub Copilot" },
      { name: "GitHub Models" },
      { name: "Sementic Kernel" },
      { name: "LangChain" },
      { name: "Azure AI Foundry" },
    ]
  },  {
    name: "Frontend Development",
    skills: [
      { name: "TypeScript", icon: "/images/skills/frontend/typescript.svg" },
      { name: "React", icon: "/images/skills/frontend/react.svg" },
      { name: "Next.js", icon: "/images/skills/frontend/nextjs.svg" },
      { name: "Angular", icon: "/images/skills/frontend/angular.svg" },
      { name: "Blazor", icon: "/images/skills/frontend/blazor.svg" },
      { name: "Tailwind CSS", icon: "/images/skills/frontend/tailwind.svg" },
    ]
  },  {
    name: "Development Tools",
    skills: [
      { name: "Visual Studio", icon: "/images/skills/tools/vs.svg" },
      { name: "Visual Studio Code", icon: "/images/skills/tools/vscode.svg" },
      { name: "Team Foundation Version Control" },
      { name: "Git", icon: "/images/skills/tools/git.svg" },
    ]
  },
];

// If you still need the flat list for any reason, you can generate it like this
export const skills: string[] = skillCategories.flatMap(category => 
  category.skills.map(skill => skill.name)
);