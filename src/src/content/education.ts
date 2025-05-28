import { Diploma } from "./types/diploma";

const bachelor: Diploma = {
    name: "Bachelor in Computer Science",
    University: "École Supérieure d'Informatique (ÉSI)",
    logo: {
        src: "/credentials/esi.png",
        alt: "ESI Logo",
        width: 200,
        height: 200
    },
    details: ["Brussels, Belgium", "2017 – 2020"],
    description: `I gained a comprehensive foundation in **operating systems (Linux)**,
    **databases**, **algorithms and data structures**, **web and Java development**,
    **C/C++**, and **microprocessors**, complemented by interdisciplinary coursework
    in *economics*, *statistics*, *mathematics*, *law*, and *philosophy*, as well as 
    **UML-based software analysis**. The program also emphasized **communication skills**
    in English for technical contexts. During an internship at *Avanade* in collaboration
    with the *Microsoft Innovation Center*, I developed **custom extensions for
    Azure DevOps** using **Azure**, **.NET**, and **React**, contributing to modernizing
    internal development workflows. This experience laid the foundation for my current
    work in **cloud solutions** and **backend development**.`
};

export default bachelor;