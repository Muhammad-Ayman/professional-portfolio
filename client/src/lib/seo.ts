import type { Profile } from "@shared/content";

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  robots?: string;
}

const FALLBACK_PROFILE: Profile = {
  name: "Mohamed Salah Merza",
  title: "Proposals Expert & Founder of Merza Group",
  tagline: "Helping You Secure 7-Figure Deals Faster Through High-Impact Proposals",
  email: "mohamedsalah.merza@gmail.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  linkedin: "https://www.linkedin.com/in/mohamedsalahmerza/",
  twitter: "https://twitter.com/johndoe",
  stats: {
    years: "6+",
    proposals: "200+",
    clients: "50+",
    successRate: "75%",
  },
  bio: {
    short:
      "Strategic proposals manager with 15+ years of experience winning complex tenders and leading high-performing teams across government, enterprise, and technology sectors.",
    full: "",
  },
  mission: "To elevate proposal excellence as a strategic business function and mentor the next generation of proposal leaders.",
  philosophy: [
    "Excellence in every detail, from compliance to storytelling",
    "Proposals are conversations, not documents",
    "Data-driven strategy with human-centered execution",
    "Continuous learning and knowledge sharing",
  ],
  sectors: [
    "Government & Defense",
    "Enterprise Technology",
    "Infrastructure & Construction",
    "Healthcare & Life Sciences",
    "Financial Services",
  ],
  regions: ["North America", "Europe", "Asia-Pacific", "Middle East"],
};

export function resolveProfile(profile?: Profile): Profile {
  return profile ?? FALLBACK_PROFILE;
}

export function buildSiteConfig(profile?: Profile) {
  const data = resolveProfile(profile);
  return {
    name: data.name,
    description: data.bio.short,
    url: "https://example.com",
    ogImage: "https://example.com/og-image.png",
    twitter: "@johndoe",
    author: data.name,
  };
}

export function buildDefaultSEO(profile?: Profile): SEOMetadata {
  const data = resolveProfile(profile);
  return {
    title: `${data.name} – ${data.title}`,
    description: data.tagline,
    keywords: [
      "proposals manager",
      "thought leader",
      "proposal strategy",
      "business development",
      data.name,
    ],
    ogType: "website",
    robots: "index, follow",
  };
}

export function buildPageSEO(profile?: Profile): Record<string, SEOMetadata> {
  const data = resolveProfile(profile);
  return {
    home: {
      title: `${data.name} – ${data.title}`,
      description: data.tagline,
      keywords: [
        "proposals manager",
        "thought leader",
        "proposal strategy",
        "business development",
        "consulting",
        data.name,
      ],
      ogType: "website",
    },
    about: {
      title: `About ${data.name} – Proposals Manager & Thought Leader`,
      description: data.bio.short,
      keywords: [
        "about",
        "biography",
        "experience",
        "proposal management",
        "leadership",
        data.name,
      ],
      ogType: "profile",
    },
    portfolio: {
      title: `Case Studies – ${data.name}`,
      description:
        "Representative case studies showcasing proposal strategy, team leadership, and business impact.",
      keywords: [
        "case studies",
        "portfolio",
        "proposals",
        "wins",
        "achievements",
        "clients",
        data.name,
      ],
      ogType: "website",
    },
    insights: {
      title: `Insights – ${data.name}`,
      description:
        "Thoughts on proposal strategy, leadership, and industry trends.",
      keywords: [
        "insights",
        "articles",
        "blog",
        "proposal strategy",
        "leadership",
        "thought leadership",
        data.name,
      ],
      ogType: "website",
    },
    contact: {
      title: `Let's Connect – ${data.name}`,
      description:
        "Get in touch to discuss proposal strategy, leadership development, or business opportunities.",
      keywords: [
        "contact",
        "connect",
        "email",
        "message",
        "inquiry",
        data.name,
      ],
      ogType: "website",
    },
  };
}

export function generateMetaTags(metadata: SEOMetadata) {
  const tags: Record<string, string> = {
    "og:title": metadata.title,
    "og:description": metadata.description,
    "og:type": metadata.ogType || "website",
    "twitter:card": "summary_large_image",
    "twitter:title": metadata.title,
    "twitter:description": metadata.description,
  };

  if (metadata.ogImage) {
    tags["og:image"] = metadata.ogImage;
    tags["twitter:image"] = metadata.ogImage;
  }

  return tags;
}

export function getCanonicalUrl(path: string): string {
  return `${siteConfig.url}${path}`;
}

export function buildPersonStructuredData(profile?: Profile) {
  const data = resolveProfile(profile);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name,
    jobTitle: data.title,
    description: data.bio.short,
    url: "https://example.com",
    email: data.email,
    telephone: data.phone,
    sameAs: data.linkedin ? [data.linkedin] : [],
    image: "https://example.com/profile-image.jpg",
    worksFor: {
      "@type": "Organization",
      name: "Independent Consultant",
    },
  };
}

export function buildOrganizationSchema(profile?: Profile) {
  const data = resolveProfile(profile);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name,
    description: data.bio.short,
    url: "https://example.com",
    logo: "https://example.com/logo.png",
    sameAs: data.linkedin ? [data.linkedin] : [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: data.email,
      telephone: data.phone,
    },
  };
}

export const siteConfig = buildSiteConfig();
export const defaultSEO = buildDefaultSEO();
export const pageSEO = buildPageSEO();
export const personStructuredData = buildPersonStructuredData();
export const organizationSchema = buildOrganizationSchema();

