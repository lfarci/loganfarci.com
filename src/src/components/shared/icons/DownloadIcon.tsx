import SvgIcon, { SvgIconProps } from "./SvgIcon";

const DownloadIcon = (props: SvgIconProps) => (
    <SvgIcon fill="none" strokeWidth={2} viewBox="0 0 24 24" {...props}>
        <path d="M12 3v12m0 0 4-4m-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
    </SvgIcon>
);

export default DownloadIcon;
