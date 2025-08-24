import SvgIcon, { SvgIconProps } from "./SvgIcon";

const MoonIcon: React.FC<SvgIconProps> = (props) => (
    <span>
        <SvgIcon {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                stroke="currentColor"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
        </SvgIcon>
    </span>
);

export default MoonIcon;
