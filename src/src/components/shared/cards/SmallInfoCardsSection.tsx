import React from "react";
import { SmallInfoCard, SmallInfoCardProps } from "@/components/shared/cards";
import Section from "@/components/shared/Section";

type SmallInfoCardsSectionProps = {
    heading: string;
    items: SmallInfoCardProps[];
};

const SmallInfoCardsGridSection: React.FC<SmallInfoCardsSectionProps> = ({ heading, items }) => <Section heading={heading}>
    <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => <SmallInfoCard key={index} {...item} />)}
    </div>
</Section>;

export default SmallInfoCardsGridSection;
