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
            logo: {
                src: "/avanade.png",
                alt: "Avanade Logo",
                width: 200,
                height: 200
            }
        },
        description: `- **Led the development** of enterprise-grade solutions using Microsoft Azure, .NET, and React for global clients.
- **Architected and delivered** scalable cloud applications with Azure, Infrastructure as Code, and clean architectural patterns.
- **Championed code quality:** Implemented clean code principles, resulting in maintainable and testable software.
- **Mentored junior developers** and guided them through various clients and internal projects.
- **Collaborated with clients** to translate business requirements into robust, secure, and high-performance solutions.
- **Promoted agile methodologies:** Scrum practitioner focused on continuous improvement and team effectiveness.`
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
            logo: {
                src: "/smals.png",
                alt: "Smals Logo",
                width: 200,
                height: 200
            }
        },
        description: `- **Developed and maintained** critical .NET Core, ASP.NET, and SQL Server applications for the Belgian public sector.
- **Designed and delivered** secure, high-availability backend services in collaboration with cross-functional teams.
- **Contributed to cloud migration** projects and automated deployment pipelines using Azure DevOps.
- **Advocated for best practices:** Code reviews, documentation, and high standards for code quality.
- **Worked in agile teams** to ensure timely, robust delivery of business features.`
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
            logo: {
                src: "/avanade.png",
                alt: "Avanade Logo",
                width: 200,
                height: 200
            }
        },
        description: `- **Designed and built** a proof-of-concept cloud-native application using Azure Functions and .NET Core.
- **Explored modern DevOps workflows:** Automated builds and deployments with best practices in mind.
- **Applied clean code principles** and prioritized security and scalability.
- **Presented technical demos** and findings to both technical and non-technical audiences.`
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
            logo: {
                src: "/microsoft.jpg",
                alt: "Microsoft Logo",
                width: 200,
                height: 200
            }
        },
        description: `- **Contributed to innovation projects** supporting startups and entrepreneurs in the local tech ecosystem.
- **Developed prototypes and MVPs** using Microsoft Azure and modern web technologies.
- **Participated in design sprints** and workshops, honing rapid solution development skills.
- **Enhanced communication and teamwork** in a dynamic, fast-paced environment.`
    },
];

export default experiences;