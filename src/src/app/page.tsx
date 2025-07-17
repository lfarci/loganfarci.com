import Introduction from "@/components/home/Introduction";
import FeaturedArticles from "@/components/home/FeaturedArticles";
import { content } from "../content/home";
import { Relevance } from "@/content/types";
import TextSection from "@/components/shared/TextSection";
import ThumbnailGridSection from "@/components/shared/ThumbnailGridSection";

export default function Home() {
    const certifications = content.credentials.filter((c) => c.relevance == Relevance.High);
    return (
        <div className="flex flex-col space-y-4">
            <Introduction introduction={content.introduction} image={content.image} contacts={content.contacts} />
            <TextSection heading="About Me" text={content.about} />
            <ThumbnailGridSection heading="What I Do" size="small" columns={2} items={content.interests} />
            <FeaturedArticles />
            <ThumbnailGridSection
                heading="My Certifications"
                size="large"
                columns={3}
                items={certifications}
                redirectPath="/about#certifications"
                redirectLabel="Show all my certifications"
            />
        </div>
    );
}
