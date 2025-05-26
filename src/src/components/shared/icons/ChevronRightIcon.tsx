import SvgIcon, { SvgIconProps } from "./SvgIcon";

const ChevronRightIcon: React.FC<SvgIconProps> = (props) => <span>
    <SvgIcon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </SvgIcon>
</span>;

export default ChevronRightIcon;
