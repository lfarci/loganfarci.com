import ArticleListSection from "@/components/ArticleListSection";
import ContactLinks from "@/components/ContactLinks";
import HeroSection from "@/components/HeroSection";
import ColumnContainer from "@/components/layout/ColumnContainer";
import TextSection from "@/components/shared/TextSection";
import ThumbnailGridSection from "@/components/shared/ThumbnailGridSection";
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
