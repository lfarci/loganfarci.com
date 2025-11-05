import { getTechnologies } from "./data";

export interface TechnologyIcon {
    src: string;
    alt: string;
}

let technologyIconMap: Map<string, TechnologyIcon> | null = null;

function buildTechnologyIconMap(): Map<string, TechnologyIcon> {
    const map = new Map<string, TechnologyIcon>();
    const technologies = getTechnologies();
    
    technologies.forEach((technology) => {
        const icon: TechnologyIcon = {
            src: technology.icon,
            alt: `${technology.name} icon`,
        };
        map.set(technology.name.toLowerCase(), icon);
    });

    return map;
}

export function getTechnologyIcon(technologyName: string): TechnologyIcon | null {
    if (technologyIconMap === null) {
        technologyIconMap = buildTechnologyIconMap();
    }

    const normalizedName = technologyName.toLowerCase().trim();
    return technologyIconMap.get(normalizedName) || null;
}
