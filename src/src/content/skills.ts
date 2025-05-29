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
      { name: ".NET", icon: "/skills/dotnet.svg" },
      { name: "C#", icon: "/skills/csharp.svg" },
      { name: "ASP.NET" },
      { name: "Entity Framework" },
      { name: "Blazor", icon: "/skills/blazor.svg" },
      { name: "xUnit" },
      { name: "MSTest" },
    ]
  },
  {
    name: "Cloud Computing",
    skills: [
      { name: "Azure App Service", icon: "/skills/azure/app-service.svg" },
      { name: "Azure Static Web App", icon: "/skills/azure/static-web-apps.svg" },
      { name: "Azure Functions", icon: "/skills/azure/function-apps.svg" },
      { name: "Azure Cosmos DB", icon: "/skills/azure/cosmos-db.svg" },
      { name: "Azure SQL Database", icon: "/skills/azure/sql-database.svg" },
      { name: "Azure Container Registry", icon: "/skills/azure/container-registry.svg" },
      { name: "Azure Container Instances", icon: "/skills/azure/container-instances.svg" },
      { name: "Azure Blob Storage", icon: "/skills/azure/blob-storage.svg" },
      { name: "Azure Communication Services", icon: "/skills/azure/communication-services.svg" },
      { name: "Azure Monitor", icon: "/skills/azure/monitor.svg" },
      { name: "Azure Key Vault", icon: "/skills/azure/key-vault.svg" },
      { name: "Azure API Management", icon: "/skills/azure/api-management.svg" },
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
      { name: "Azure AI Foundry" },
    ]
  },
  {
    name: "Frontend Development",
    skills: [
      { name: "TypeScript", icon: "/skills/typescript.svg" },
      { name: "React", icon: "/skills/react.svg" },
      { name: "Next.js", icon: "/skills/nextjs.svg" },
      { name: "Angular", icon: "/skills/angular.svg" },
      { name: "Tailwind CSS", icon: "/skills/tailwind.svg" },
    ]
  },
  {
    name: "Development Tools",
    skills: [
      { name: "Visual Studio", icon: "/skills/vs.svg" },
      { name: "Visual Studio Code", icon: "/skills/vscode.svg" },
      { name: "Team Foundation Version Control" },
      { name: "Git", icon: "/skills/git.svg" },
    ]
  },
];

// If you still need the flat list for any reason, you can generate it like this
export const skills: string[] = skillCategories.flatMap(category => 
  category.skills.map(skill => skill.name)
);