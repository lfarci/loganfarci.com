import React from "react";
import { CardGrid } from "./Card";
import SmallInfoCard, { SmallInfoCardProps } from "./SmallInfoCard";
import Section from "@/components/shared/Section";

type SmallInfoCardsSectionProps = { heading: string; items: SmallInfoCardProps[] };

const SmallInfoCardsGridSection: React.FC<SmallInfoCardsSectionProps> = ({ heading, items }) => (
    <Section heading={heading}>
        <CardGrid columns={2} className="mt-4">
            {items.map((item, index) => (
                <SmallInfoCard key={index} {...item} />
            ))}
        </CardGrid>
    </Section>
);

export default SmallInfoCardsGridSection;
