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
      { name: ".NET", icon: "/images/dotnet.svg" },
      { name: "C#", icon: "/images/csharp.svg" },
      { name: "ASP.NET" },
      { name: "Entity Framework" },
      { name: "Blazor", icon: "/images/blazor.svg" },
      { name: "xUnit" },
      { name: "MSTest" },
    ]
  },
  {
    name: "Cloud Computing",
    skills: [
      { name: "Azure App Service", icon: "/images/azure/app-service.svg" },
      { name: "Azure Static Web App", icon: "/images/azure/static-web-apps.svg" },
      { name: "Azure Functions", icon: "/images/azure/function-apps.svg" },
      { name: "Azure Cosmos DB", icon: "/images/azure/cosmos-db.svg" },
      { name: "Azure SQL Database", icon: "/images/azure/sql-database.svg" },
      { name: "Azure Container Registry", icon: "/images/azure/container-registry.svg" },
      { name: "Azure Container Instances", icon: "/images/azure/container-instances.svg" },
      { name: "Azure Blob Storage", icon: "/images/azure/blob-storage.svg" },
      { name: "Azure Communication Services", icon: "/images/azure/communication-services.svg" },
      { name: "Azure Monitor", icon: "/images/azure/monitor.svg" },
      { name: "Azure Key Vault", icon: "/images/azure/key-vault.svg" },
      { name: "Azure API Management", icon: "/images/azure/api-management.svg" },
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
  },
  {
    name: "Frontend Development",
    skills: [
      { name: "TypeScript", icon: "/images/typescript.svg" },
      { name: "React", icon: "/images/react.svg" },
      { name: "Next.js", icon: "/images/nextjs.svg" },
      { name: "Angular", icon: "/images/angular.svg" },
      { name: "Tailwind CSS", icon: "/images/tailwind.svg" },
    ]
  },
  {
    name: "Development Tools",
    skills: [
      { name: "Visual Studio", icon: "/images/vs.svg" },
      { name: "Visual Studio Code", icon: "/images/vscode.svg" },
      { name: "Team Foundation Version Control" },
      { name: "Git", icon: "/images/git.svg" },
    ]
  },
];

// If you still need the flat list for any reason, you can generate it like this
export const skills: string[] = skillCategories.flatMap(category => 
  category.skills.map(skill => skill.name)
);