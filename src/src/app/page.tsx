import Introduction from "@/components/home/Introduction";
import FeaturedArticles from "@/components/home/FeaturedArticles";
import { content } from "../content/home";
import TextSection from "@/components/shared/TextSection";
import ThumbnailGridSection from "@/components/shared/ThumbnailGridSection";
import { getCertifications, getContacts, getInterests } from "@/core/data";

const featuredCertifications = getCertifications().filter((c) => c.relevance == "High");
const interests = getInterests();
const contacts = getContacts();

export default function Home() {
    return (
        <div className="flex flex-col space-y-4">
            <Introduction introduction={content.introduction} image={content.image} contacts={contacts} />
            <TextSection heading="About Me" text={content.about} />
            <ThumbnailGridSection heading="What I Do" size="large" columns={2} items={interests} />
            <FeaturedArticles />
            <ThumbnailGridSection
                heading="My Certifications"
                size="large"
                columns={3}
                items={featuredCertifications}
                redirectPath="/about#certifications"
                redirectLabel="Show all my certifications"
            />
        </div>
    );
}
