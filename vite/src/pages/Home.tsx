import Introduction from "@/components/home/Introduction";
import FeaturedArticles from "@/components/home/FeaturedArticles";
import TextSection from "@/components/shared/TextSection";
import ThumbnailGridSection from "@/components/shared/ThumbnailGridSection";
import certifications from "../data/certifications.json";
import contacts from "../data/contacts.json";
import interests from "../data/interests.json";
import profile from "../data/profile.json";

const featuredCertifications = certifications.filter((c) => c.relevance === "High");

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