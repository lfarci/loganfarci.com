import { Tooltip } from "@heroui/react";
import { Link } from "react-router";
import ChevronRightIcon from "./icons/ChevronRightIcon";
import { Heading2, Text } from "@/components/shared/typography";
import { createId } from "@/core/string";

interface SectionProps {
    heading: string;
    redirectPath?: string;
    redirectLabel?: string;
    id?: string;
    children?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ heading, redirectPath, redirectLabel, children, id }) => {
    const toolTip = <Text>{redirectLabel}</Text>;
    const headingContent = (
        <>
            <Heading2 className="mb-0 text-balance">{heading}</Heading2>
            {redirectPath && (
                <ChevronRightIcon
                    className="size-7 shrink-0 self-center text-text-tertiary transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary md:size-8"
                    strokeWidth={2}
                    aria-hidden="true"
                />
            )}
        </>
    );

    return (
        <section id={id ?? createId(heading)} className="py-8 scroll-mt-24 md:py-12">
            <div className="mb-5 flex items-center">
                {redirectPath ? (
                    <Tooltip content={toolTip} placement="right">
                        <Link
                            to={redirectPath}
                            aria-label={redirectLabel ?? heading}
                            className="group -ml-1 flex items-center gap-2 rounded-lg px-1 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                        >
                            {headingContent}
                        </Link>
                    </Tooltip>
                ) : (
                    headingContent
                )}
            </div>
            {children}
        </section>
    );
};

export default Section;
