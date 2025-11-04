import Introduction from "@/components/home/Introduction";
import FeaturedArticles from "@/components/home/FeaturedArticles";
import TextSection from "@/components/shared/TextSection";
import ThumbnailGridSection from "@/components/shared/ThumbnailGridSection";
import { getCertifications, getContacts, getInterests, getProfile } from "@/core/data";

const featuredCertifications = getCertifications().filter((c) => c.relevance == "High");
const interests = getInterests();
const contacts = getContacts();
const profile = getProfile();

export default function Home() {
    return (
        <div className="flex flex-col space-y-4">
            <Introduction introduction={profile.role} image={profile.avatar} contacts={contacts} />
            <TextSection 
                heading="About Me" 
                text={profile.introduction} 
                redirectPath="/about#about-me"
                redirectLabel="Read more about me"
            />
            <ThumbnailGridSection 
                heading="What I Do" 
                size="large" 
                columns={2} 
                items={interests}
                redirectPath="/about#skills"
                redirectLabel="Explore my skills in detail"
            />
            <ThumbnailGridSection
                heading="My Certifications"
                size="large"
                columns={3}
                items={featuredCertifications}
                redirectPath="/about#certifications"
                redirectLabel="Show all my certifications"
            />
            <FeaturedArticles />
        </div>
    );
}
