import SvgIcon, { SvgIconProps } from "./SvgIcon";

const EmailIcon: React.FC<SvgIconProps> = (props) => (
    <SvgIcon {...props} strokeWidth={4} viewBox="2.909 7.273 40.727 32">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            d="M42.182 13.091v20.363a4.364 4.364 0 0 1 -4.364 4.364h-29.091a4.364 4.364 0 0 1 -4.364 -4.364V13.091m37.818 0A4.364 4.364 0 0 0 37.818 8.727h-29.091a4.364 4.364 0 0 0 -4.364 4.364m37.818 0v0.471a4.364 4.364 0 0 1 -2.075 3.716l-14.545 8.95a4.364 4.364 0 0 1 -4.577 0L6.439 17.28a4.364 4.364 0 0 1 -2.075 -3.716V13.091"
        />
    </SvgIcon>
);

export default EmailIcon;
