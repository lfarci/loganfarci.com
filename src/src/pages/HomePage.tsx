import ArticleListSection from "@/components/ArticleListSection";
import ContactLinks from "@/components/ContactLinks";
import GreetingHeading from "@/components/GreetingHeading";
import HeroSection from "@/components/HeroSection";
import ColumnContainer from "@/components/layout/ColumnContainer";
import TextSection from "@/components/shared/TextSection";
import ThumbnailGridSection from "@/components/shared/ThumbnailGridSection";
import { getFeaturedArticles } from "@/core/articles";
import { getCertifications, getContacts, getInterests, getProfile } from "@/core/data";
import { createCanonicalUrl } from "@/core/seo";

const featuredCertifications = getCertifications().filter((c) => c.relevance == "High");
const interests = getInterests();
const contacts = getContacts();
const profile = getProfile();
const featuredArticles = getFeaturedArticles();

const pageTitle = "Logan Farci - Software Engineer";
const pageDescription = "Software Engineer specializing in Azure, C#, .NET, and cloud-native solutions. Explore my work, articles, and certifications.";
const pageUrl = createCanonicalUrl("/");

export default function HomePage() {
    return (
        <>
            <title>{pageTitle}</title>
            <link rel="canonical" href={pageUrl} />
            <meta name="description" content={pageDescription} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:url" content={pageUrl} />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={pageDescription} />
            <ColumnContainer>
                <HeroSection
                    heading={<GreetingHeading greeting="Hi" name="Logan" />}
                    description={profile.role}
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
                    redirectPath="/articles"
                    redirectLabel="View all my articles"
                    emptyMessage="No featured articles found."
                    reveal
                />
            </ColumnContainer>
        </>
    );
}
