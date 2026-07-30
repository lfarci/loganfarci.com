import SvgIcon, { SvgIconProps } from "./SvgIcon";

const LinkIcon = (props: SvgIconProps) => (
    <SvgIcon {...props} fill="none" strokeWidth={2} viewBox="0 0 24 24">
        <path
            d="M10.25 13.75a4.25 4.25 0 0 0 6.01 0l2.49-2.49a4.25 4.25 0 0 0-6.01-6.01l-1.43 1.43"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M13.75 10.25a4.25 4.25 0 0 0-6.01 0l-2.49 2.49a4.25 4.25 0 0 0 6.01 6.01l1.43-1.43"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </SvgIcon>
);

export default LinkIcon;
