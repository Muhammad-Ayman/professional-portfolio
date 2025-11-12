import prisma from "./prisma";
import type { CaseStudy, ContentData, FAQ, Insight, Profile } from "@/types/content";
import { ApiError } from "./http";

function transformProfile(prismaProfile: any): Profile {
  return {
    name: prismaProfile.name,
    title: prismaProfile.title,
    tagline: prismaProfile.tagline,
    email: prismaProfile.email,
    phone: prismaProfile.phone,
    location: prismaProfile.location,
    profileImage: prismaProfile.profileImage ?? undefined,
    linkedin: prismaProfile.linkedin ?? undefined,
    twitter: prismaProfile.twitter ?? undefined,
    stats: {
      yearsOfExperience: prismaProfile.statsYearsOfExperience,
      totalFundingSecured: prismaProfile.statsTotalFundingSecured,
      countries: prismaProfile.statsCountries,
      winningRate: prismaProfile.statsWinningRate,
    },
    bio: {
      short: prismaProfile.bioShort,
      full: prismaProfile.bioFull,
    },
    mission: prismaProfile.mission,
    philosophy: prismaProfile.philosophy,
    sectors: prismaProfile.sectors,
    regions: prismaProfile.regions,
  };
}

function transformProfileToPrisma(profile: Profile) {
  return {
    name: profile.name,
    title: profile.title,
    tagline: profile.tagline,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    profileImage: profile.profileImage,
    linkedin: profile.linkedin,
    twitter: profile.twitter,
    statsYearsOfExperience: profile.stats.yearsOfExperience,
    statsTotalFundingSecured: profile.stats.totalFundingSecured,
    statsCountries: profile.stats.countries,
    statsWinningRate: profile.stats.winningRate,
    bioShort: profile.bio.short,
    bioFull: profile.bio.full,
    mission: profile.mission,
    philosophy: profile.philosophy,
    sectors: profile.sectors,
    regions: profile.regions,
  };
}

function notFound(resource: string) {
  return new ApiError(404, `${resource} not found`);
}

export async function getAllContent(): Promise<ContentData> {
  const [profileData, caseStudies, insights, faqs] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "profile" } }),
    prisma.caseStudy.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.insight.findMany({
      orderBy: [{ featured: "desc" }, { date: "desc" }],
    }),
    prisma.fAQ.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  if (!profileData) {
    throw notFound("Profile");
  }

  return {
    profile: transformProfile(profileData),
    caseStudies,
    insights,
    faqs,
  };
}

export async function getProfile(): Promise<Profile> {
  const profileData = await prisma.profile.findUnique({
    where: { id: "profile" },
  });

  if (!profileData) {
    throw notFound("Profile");
  }

  return transformProfile(profileData);
}

export async function updateProfile(profile: Profile): Promise<Profile> {
  const prismaProfile = transformProfileToPrisma(profile);

  const updated = await prisma.profile.upsert({
    where: { id: "profile" },
    update: prismaProfile,
    create: {
      id: "profile",
      ...prismaProfile,
    },
  });

  return transformProfile(updated);
}

export async function updateAdminToken(token: string): Promise<void> {
  await prisma.profile.upsert({
    where: { id: "profile" },
    update: { adminToken: token },
    create: {
      id: "profile",
      adminToken: token,
      name: "Admin",
      title: "Admin",
      tagline: "Admin",
      email: "admin@example.com",
      phone: "",
      location: "",
      statsYearsOfExperience: "0",
      statsTotalFundingSecured: "0",
      statsCountries: "0",
      statsWinningRate: "0",
      bioShort: "",
      bioFull: "",
      mission: "",
      philosophy: [],
      sectors: [],
      regions: [],
    },
  });
}

export async function getAdminToken(): Promise<string | null> {
  const profile = await prisma.profile.findUnique({
    where: { id: "profile" },
    select: { adminToken: true },
  });
  return profile?.adminToken ?? null;
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return prisma.caseStudy.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
}

export async function createCaseStudy(
  payload: Omit<CaseStudy, "id"> & Partial<Pick<CaseStudy, "id">>
): Promise<CaseStudy> {
  const data: any = {
    title: payload.title,
    client: payload.client,
    sector: payload.sector,
    contractValue: payload.contractValue,
    country: payload.country,
    description: payload.description,
    keyAchievements: payload.keyAchievements,
    image: payload.image,
    featured: payload.featured,
    order: payload.order,
  };

  if (payload.id) {
    data.id = payload.id;
  }

  return prisma.caseStudy.create({ data });
}

export async function updateCaseStudy(
  id: string,
  payload: Partial<CaseStudy>
): Promise<CaseStudy> {
  try {
    return await prisma.caseStudy.update({
      where: { id },
      data: payload,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      throw notFound("Case study");
    }
    throw error;
  }
}

export async function deleteCaseStudy(id: string): Promise<void> {
  try {
    await prisma.caseStudy.delete({
      where: { id },
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      throw notFound("Case study");
    }
    throw error;
  }
}

export async function getInsights(): Promise<Insight[]> {
  return prisma.insight.findMany({
    orderBy: [{ featured: "desc" }, { date: "desc" }],
  });
}

export async function createInsight(
  payload: Omit<Insight, "id"> & Partial<Pick<Insight, "id">>
): Promise<Insight> {
  const data: any = {
    title: payload.title,
    excerpt: payload.excerpt,
    content: payload.content,
    category: payload.category,
    date: payload.date,
    readTime: payload.readTime,
    featured: payload.featured,
  };

  if (payload.id) {
    data.id = payload.id;
  }

  return prisma.insight.create({ data });
}

export async function updateInsight(
  id: string,
  payload: Partial<Insight>
): Promise<Insight> {
  try {
    return await prisma.insight.update({
      where: { id },
      data: payload,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      throw notFound("Insight");
    }
    throw error;
  }
}

export async function deleteInsight(id: string): Promise<void> {
  try {
    await prisma.insight.delete({
      where: { id },
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      throw notFound("Insight");
    }
    throw error;
  }
}

export async function getFAQs(): Promise<FAQ[]> {
  return prisma.fAQ.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function createFAQ(
  payload: Omit<FAQ, "id"> & Partial<Pick<FAQ, "id">>
): Promise<FAQ> {
  const data: any = {
    question: payload.question,
    answer: payload.answer,
    order: payload.order,
  };

  if (payload.id) {
    data.id = payload.id;
  }

  return prisma.fAQ.create({ data });
}

export async function updateFAQ(
  id: string,
  payload: Partial<FAQ>
): Promise<FAQ> {
  try {
    return await prisma.fAQ.update({
      where: { id },
      data: payload,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      throw notFound("FAQ");
    }
    throw error;
  }
}

export async function deleteFAQ(id: string): Promise<void> {
  try {
    await prisma.fAQ.delete({
      where: { id },
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      throw notFound("FAQ");
    }
    throw error;
  }
}
