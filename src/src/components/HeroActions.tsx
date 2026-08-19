import { Link } from "react-router";
import type { FC } from "react";
import ContactLinks from "@/components/ContactLinks";
import { Button } from "@/components/shared/primitives/Button";
import type { Contact } from "@/types";

interface HeroActionsProps {
    contacts: Contact[];
}

// Keep discovery actions labeled and prominent while separating social utilities from the CTA hierarchy.
const HeroActions: FC<HeroActionsProps> = ({ contacts }) => (
    <div className="flex flex-col items-start gap-5" aria-label="Homepage actions">
        <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
                <Link to="/about">Explore my profile</Link>
            </Button>
            <Button asChild variant="secondary">
                <Link to="/articles">Read my articles</Link>
            </Button>
        </div>
        <ContactLinks contacts={contacts} className="gap-2 [&_a]:size-9 [&_svg]:size-6" />
    </div>
);

export default HeroActions;
