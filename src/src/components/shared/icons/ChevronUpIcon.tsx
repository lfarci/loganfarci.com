import SvgIcon, { SvgIconProps } from "./SvgIcon";

const ChevronDownIcon: React.FC<SvgIconProps> = (props) => (
    <span>
        <SvgIcon {...props}>
            <path
                fillRule="evenodd"
                d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
                clipRule="evenodd"
            />
        </SvgIcon>
    </span>
);

export default ChevronDownIcon;
