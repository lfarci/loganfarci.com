import { Tooltip } from "@heroui/react";
import ChevronRightIcon from "./icons/ChevronRightIcon";
import { Heading1, Text } from "@/components/shared/typography";
import { createId } from "@/core/string";

interface SectionProps {
    heading: string;
    redirectPath?: string;
    redirectLabel?: string;
    id?: string;
    children?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ heading, redirectPath, redirectLabel, children, id }) => {
    const handleNavigation = () => {
        if (!redirectPath) return;

        const url = redirectPath.startsWith("/") ? `${window.location.origin}${redirectPath}` : redirectPath;

        window.location.assign(url);
    };

    const toolTip = <Text>{redirectLabel}</Text>;

    return (
        <section id={id ?? createId(heading)} className="pt-8 scroll-mt-24">
            <div
                className={`flex items-center mb-4${redirectPath ? " cursor-pointer" : ""}`}
                onClick={handleNavigation}
            >
                {redirectPath ? (
                    <Tooltip content={toolTip} placement="right">
                        <span className="flex items-center">
                            <Heading1 className="mb-0">{heading}</Heading1>
                            <ChevronRightIcon
                                className="size-7 md:size-9 ml-2 shrink-0 self-center text-text-tertiary cursor-pointer"
                                strokeWidth={2}
                            />
                        </span>
                    </Tooltip>
                ) : (
                    <Heading1 className="mb-0">{heading}</Heading1>
                )}
            </div>
            {children}
        </section>
    );
};

export default Section;
