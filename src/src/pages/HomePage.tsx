import ArticleListSection from "@/components/ArticleListSection";
import CertificationShowcase from "@/components/CertificationShowcase";
import ContactLinks from "@/components/ContactLinks";
import HeroSection from "@/components/HeroSection";
import HomeCapabilitiesSection from "@/components/HomeCapabilitiesSection";
import ColumnContainer from "@/components/layout/ColumnContainer";
import TextSection from "@/components/shared/TextSection";
import { Heading1 } from "@/components/shared/typography";
import { getFeaturedArticles } from "@/core/articles";
import { getCertifications, getContacts, getInterests, getProfile } from "@/core/data";

const featuredCertifications = getCertifications().filter((c) => c.relevance == "High");
const interests = getInterests();
const contacts = getContacts();
const profile = getProfile();
const featuredArticles = getFeaturedArticles();

export default function HomePage() {
    return (
        <>
            <title>Logan Farci - Software Engineer</title>
            <meta name="description" content="Logan Farci, Software Engineer" />
            <ColumnContainer>
                <HeroSection
                    eyebrow="Azure • GitHub • .NET • DevOps"
                    heading={
                        <Heading1 className="max-w-3xl text-balance">
                            Building reliable cloud systems and developer workflows.
                        </Heading1>
                    }
                    description={profile.introduction}
                    image={profile.avatar}
                    actions={<ContactLinks contacts={contacts} />}
                />
                <TextSection 
                    heading="About Me" 
                    text={profile.introduction} 
                    redirectPath="/about#about-me"
                    redirectLabel="Read more about me"
                />
                <HomeCapabilitiesSection
                    heading="What I Do"
                    items={interests}
                    redirectPath="/about#skills"
                    redirectLabel="Explore my skills in detail"
                />
                <CertificationShowcase
                    heading="My Certifications"
                    certifications={featuredCertifications}
                    redirectPath="/about#certifications"
                    redirectLabel="Show all my certifications"
                />
                <ArticleListSection
                    heading="Featured Articles"
                    articles={featuredArticles}
                    limit={4}
                    featureFirst
                    redirectPath="/articles"
                    redirectLabel="View all my articles"
                    emptyMessage="No featured articles found."
                />
            </ColumnContainer>
        </>
    );
}
