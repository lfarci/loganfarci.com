import SvgIcon, { SvgIconProps } from "./SvgIcon";

const ChevronDownIcon = (props: SvgIconProps) => (
    <SvgIcon fill="none" strokeWidth={2} viewBox="0 0 24 24" {...props}>
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </SvgIcon>
);

export default ChevronDownIcon;
