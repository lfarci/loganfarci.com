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
    },
    {
        name: "Software Engineer Intern",
        start: new Date("2020-02-01"),
        end: new Date("2020-05-01"),
        type: "Internship",
        company: {
            name: "Microsoft Inovation Center",
            website: "https://www.microsoftinnovationcenters.com",
            location: "Brussels, Brussels-Capital Region, Belgium",
            logo: {
                src: "/microsoft.jpg",
                alt: "Microsoft Logo",
                width: 200,
                height: 200
            }
        },
    },
];

export default experiences;