import iconsData from "../data/icons.json";

export interface IconData {
    src: string;
    alt: string;
}

let iconMap: Map<string, IconData> | null = null;

function buildIconMap(): Map<string, IconData> {
    const map = new Map<string, IconData>();
    
    iconsData.forEach((icon) => {
        const iconData: IconData = {
            src: icon.icon,
            alt: `${icon.name} icon`,
        };
        map.set(icon.name.toLowerCase(), iconData);
    });

    return map;
}

export function getIcon(iconName: string): IconData | null {
    if (iconMap === null) {
        iconMap = buildIconMap();
    }

    const normalizedName = iconName.toLowerCase().trim();
    return iconMap.get(normalizedName) || null;
}
