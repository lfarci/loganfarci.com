import Tooltip from "@/components/shared/Tooltip";
import { ChevronDownIcon } from "@/components/shared/icons";
import { Button } from "@/components/shared/primitives/Button";

interface ChevronToggleButtonProps {
    isExpanded: boolean;
    onToggle: () => void;
    controls: string;
}

function ChevronToggleButton({ isExpanded, onToggle, controls }: ChevronToggleButtonProps) {
    const toggleText = isExpanded ? "Show less" : "Show more";

    return (
        <div className="flex justify-center mt-2">
            <Tooltip content={toggleText} placement="bottom">
                <Button
                    onClick={onToggle}
                    type="button"
                    aria-label={toggleText}
                    aria-expanded={isExpanded}
                    aria-controls={controls}
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                >
                    <ChevronDownIcon
                        strokeWidth={1}
                        className={`size-5 text-text-tertiary transition-transform duration-300 motion-reduce:transition-none ${
                            isExpanded ? "rotate-180" : ""
                        }`}
                    />
                </Button>
            </Tooltip>
        </div>
    );
}

export default ChevronToggleButton;
