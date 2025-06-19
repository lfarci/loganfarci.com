import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Article } from '@/content/types';

const articlesDirectory = path.join(process.cwd(), 'src/content/articles');

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }
  
  return fs.readdirSync(articlesDirectory)
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace(/\.md$/, ''));
}

export function getArticleBySlug(slug: string): Article | null {
  const articlePath = path.join(articlesDirectory, `${slug}.md`);
  
  if (!fs.existsSync(articlePath)) {
    return null;
  }

  const article = fs.readFileSync(articlePath, 'utf8');
  const { data, content } = matter(article);

  return {
    slug,
    title: data.title || '',
    description: data.description || '',
    publishedAt: data.publishedAt || '',
    featured: data.featured || false,
    tags: data.tags || [],
    content,
  };
}

export function getAllArticles(): Article[] {
  const slugs = getArticleSlugs();
  return slugs
    .map(slug => getArticleBySlug(slug))
    .filter((article): article is Article => article !== null)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getFeaturedArticles(): Article[] {
  return getAllArticles().filter(article => article.featured);
}