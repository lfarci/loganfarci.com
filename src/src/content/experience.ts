import { Experience } from "./types/experience";

const experiences: Experience[] = [
    {
        name: "Senior Analyst, Full-Stack Developer",
        start: new Date("2022-06-01"),
        type: "Full-Time",
        company: {
            name: "Avanade",
            website: "https://www.avanade.com",
            location: "Merelbeke, Flanders, Belgium",
            logo: { src: "/images/experience/avanade.png", alt: "Avanade Logo", width: 200, height: 200 },
        },
        description: `A global leader in digital innovation and cloud services, created by Accenture and Microsoft to help organizations accelerate their digital transformation.

- **Led development** of enterprise-grade solutions using Azure, .NET, and the Microsoft ecosystem for global clients.  
- **Architected and delivered** scalable cloud applications using Azure, Infrastructure as Code, and clean architectural patterns.  
- **Championed code quality** by applying clean code principles, resulting in maintainable, testable software.  
- **Mentored junior developers** and interns across a variety of client and internal projects.  
- **Collaborated with clients** to turn business requirements into secure, high-performance solutions.  
- **Promoted agile practices** as a hands-on Scrum practitioner focused on continuous improvement and team effectiveness.`,
    },
    {
        name: "Analyst Developer",
        start: new Date("2020-11-01"),
        end: new Date("2022-06-01"),
        type: "Full-Time",
        company: {
            name: "Smals",
            website: "https://smals.be/",
            location: "Brussels, Brussels-Capital Region, Belgium",
            logo: { src: "/images/experience/smals.png", alt: "Smals Logo", width: 200, height: 200 },
        },
        description: `A Belgian non-profit IT organization that partners with public sector institutions to design and deliver secure, innovative, and scalable digital services for citizens and government agencies. Worked at the Belgian National Employment Office (ONEM) through Smals.

- **Contributed to mainframe system migration to Linux** and modernization of legacy systems.  
- **Maintained and debugged** a C++ shared library on Linux and supported a custom mainframe emulator.  
- **Developed web applications** using Angular, Spring Boot, Docker, and Kubernetes to support government workflows.  
- **Automated deployments** using Atlassian Bamboo, improving release speed and reliability.  
- **Worked within agile teams**, using Jira for sprint planning and Bitbucket for source control.  
- **Implemented testing strategies** with Cypress, Cucumber, Jest, and JUnit to ensure code quality and coverage.`,
    },
    {
        name: "Software Engineer Intern",
        start: new Date("2020-02-01"),
        end: new Date("2020-05-01"),
        type: "Internship",
        company: {
            name: "Avanade",
            website: "https://www.avanade.com",
            location: "Merelbeke, Flanders, Belgium",
            logo: { src: "/images/experience/avanade.png", alt: "Avanade Logo", width: 200, height: 200 },
        },
        description: `A global leader in digital and cloud services, founded by Accenture and Microsoft to help organizations accelerate innovation through the Microsoft ecosystem.

- **Designed and developed** a cloud-native proof-of-concept application using React, TypeScript, Azure Functions (.NET), Azure Storage Tables, and Azure Key Vault.  
- **Created Azure DevOps web extensions** to support agile teams with mood tracking and reporting tools.  
- **Implemented automated DevOps workflows** for builds and deployments within the Azure ecosystem.  
- **Applied clean code and security best practices** with focus on scalability and maintainability.  
- **Delivered technical demos** to both technical and non-technical stakeholders.`,
    },
    {
        name: "Software Engineer Intern",
        start: new Date("2019-08-01"),
        end: new Date("2019-11-01"),
        type: "Internship",
        company: {
            name: "Microsoft Innovation Center",
            website: "https://www.microsoftinnovationcenters.com",
            location: "Brussels, Brussels-Capital Region, Belgium",
            logo: { src: "/images/experience/microsoft.jpg", alt: "Microsoft Logo", width: 200, height: 200 },
        },
        description: `A specialized prototyping internship program bridging innovation and industry experience through partnerships with leading technology companies.

- **Selected for competitive prototyping internship program** after rigorous selection sessions.  
- **Worked on Avanade-sponsored project** while receiving training and mentorship at Microsoft.  
- **Received training** on Scrum, Python, Node.js, Angular, React, Big Data, and IoT.  
- **Developed technical and soft skills** through expert-led workshops and mentorship sessions.  
- **Adapted to remote collaboration** during coronavirus outbreak, maintaining productivity through online supervision.  
- **Contributed to innovation projects** supporting startups and entrepreneurs in the local tech ecosystem.`,
    },
];

export default experiences;
