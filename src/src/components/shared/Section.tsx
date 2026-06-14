import { Link } from "react-router";
import Tooltip from "@/components/shared/Tooltip";
import ChevronRightIcon from "@/components/shared/icons/ChevronRightIcon";
import { Heading2, Label, Text } from "@/components/shared/typography";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { createId } from "@/core/string";

interface SectionProps {
    heading: string;
    label?: string;
    redirectPath?: string;
    redirectLabel?: string;
    id?: string;
    children?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ heading, label, redirectPath, redirectLabel, children, id }) => {
    const toolTip = <Text>{redirectLabel}</Text>;

    return (
        <ScrollReveal as="section" id={id ?? createId(heading)} className="pt-10 scroll-mt-24">
            <div className="flex flex-col mb-4">
                {label && (
                    <Label className="mb-2 tracking-[0.28em] text-accent-cool">
                        {label}
                    </Label>
                )}
                <div className="flex items-center">
                    {redirectPath ? (
                        <Tooltip content={toolTip} placement="right">
                            <Link
                                to={redirectPath}
                                className="group flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <Heading2 className="mb-0">{heading}</Heading2>
                                <ChevronRightIcon
                                    className="size-7 md:size-9 ml-2 shrink-0 self-center text-accent transition-transform duration-200 ease-brand group-hover:translate-x-1"
                                    strokeWidth={2}
                                />
                            </Link>
                        </Tooltip>
                    ) : (
                        <Heading2 className="mb-0">{heading}</Heading2>
                    )}
                </div>
            </div>
            {children}
        </ScrollReveal>
    );
};

export default Section;
