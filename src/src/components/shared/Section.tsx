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
            <div className="flex flex-col mb-5 md:mb-6">
                {label && (
                    <Label className="mb-2">
                        {label}
                    </Label>
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
                                    className="size-6 md:size-8 ml-2 shrink-0 self-center text-text-tertiary"
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
