import { createTypographyComponent } from "../core/BaseTypography";
import { typographyStyles } from "../core/styles";

const Label = createTypographyComponent("span", typographyStyles.label, "Label");

export default Label;
