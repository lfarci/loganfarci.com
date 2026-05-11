import { Tooltip } from "@heroui/react";
import { Link } from "react-router";
import ChevronRightIcon from "./icons/ChevronRightIcon";
import { Heading2, Text } from "@/components/shared/typography";
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
        <section id={id ?? createId(heading)} className="pt-8 scroll-mt-24">
            <div className="flex flex-col mb-4">
                {label && (
                    <span className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-1">
                        {label}
                    </span>
                )}
                <div className="flex items-center">
                    {redirectPath ? (
                        <Tooltip content={toolTip} placement="right">
                            <Link
                                to={redirectPath}
                                className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                            >
                                <Heading2 className="mb-0">{heading}</Heading2>
                                <ChevronRightIcon
                                    className="size-7 md:size-9 ml-2 shrink-0 self-center text-text-tertiary"
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
        </section>
    );
};

export default Section;
