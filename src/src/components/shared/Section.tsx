import { Link } from "react-router";
import Tooltip from "@/components/shared/Tooltip";
import ChevronRightIcon from "@/components/shared/icons/ChevronRightIcon";
import { Heading2, Label, Text } from "@/components/shared/typography";
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
        <section id={id ?? createId(heading)} className="pt-8 md:pt-10 scroll-mt-24">
            <div className="mb-5 flex flex-col border-b border-border-light pb-4 md:mb-6 md:pb-5">
                {label && <Label className="mb-2">{label}</Label>}
                <div className="flex items-center">
                    {redirectPath ? (
                        <Tooltip content={toolTip} placement="right">
                            <Link
                                to={redirectPath}
                                className="group flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                <Heading2 className="mb-0">{heading}</Heading2>
                                <ChevronRightIcon
                                    className="ml-2 size-6 shrink-0 self-center text-accent transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none md:size-7"
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
