import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CaseStudy, ContentData, Insight, Profile } from "../shared/content";

type Collection = "profile" | "caseStudies" | "insights";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileMap: Record<Collection, string> = {
  profile: "profile.json",
  caseStudies: "caseStudies.json",
  insights: "insights.json",
};

function createNotFoundError(resource: string) {
  const error = new Error(`${resource} not found`);
  (error as Error & { status?: number }).status = 404;
  return error;
}

function resolveDataDir(): string {
  if (process.env.CMS_DATA_DIR) {
    return path.resolve(process.env.CMS_DATA_DIR);
  }

  const candidateDirs = [
    path.resolve(__dirname, "data"),
    path.resolve(__dirname, "..", "data"),
    path.resolve(process.cwd(), "server", "data"),
    path.resolve(process.cwd(), "dist", "data"),
  ];

  for (const dir of candidateDirs) {
    if (fs.existsSync(dir)) {
      return dir;
    }
  }

  throw new Error("Unable to locate CMS data directory. Set CMS_DATA_DIR or ensure server/data exists.");
}

const dataDir = resolveDataDir();

async function ensureDataDir() {
  await mkdir(dataDir, { recursive: true });
}

async function readCollection<T>(collection: Collection): Promise<T> {
  const filePath = path.resolve(dataDir, fileMap[collection]);
  const fileContents = await readFile(filePath, "utf-8");
  return JSON.parse(fileContents) as T;
}

async function writeCollection<T>(collection: Collection, data: T) {
  await ensureDataDir();
  const filePath = path.resolve(dataDir, fileMap[collection]);
  const serialized = JSON.stringify(data, null, 2);
  await writeFile(filePath, serialized, "utf-8");
}

export async function getAllContent(): Promise<ContentData> {
  const [profile, caseStudies, insights] = await Promise.all([
    readCollection<Profile>("profile"),
    readCollection<CaseStudy[]>("caseStudies"),
    readCollection<Insight[]>("insights"),
  ]);

  return {
    profile,
    caseStudies,
    insights,
  };
}

export async function getProfile(): Promise<Profile> {
  return readCollection<Profile>("profile");
}

export async function updateProfile(profile: Profile): Promise<Profile> {
  await writeCollection("profile", profile);
  return profile;
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return readCollection<CaseStudy[]>("caseStudies");
}

export async function createCaseStudy(payload: Omit<CaseStudy, "id"> & Partial<Pick<CaseStudy, "id">>): Promise<CaseStudy> {
  const caseStudies = await getCaseStudies();
  const id = payload.id ?? randomUUID();
  const record: CaseStudy = { ...payload, id } as CaseStudy;
  caseStudies.push(record);
  await writeCollection("caseStudies", caseStudies);
  return record;
}

export async function updateCaseStudy(id: string, payload: Partial<CaseStudy>): Promise<CaseStudy> {
  const caseStudies = await getCaseStudies();
  const index = caseStudies.findIndex((cs) => cs.id === id);
  if (index === -1) {
    throw createNotFoundError("Case study");
  }
  const updated = { ...caseStudies[index], ...payload, id };
  caseStudies[index] = updated;
  await writeCollection("caseStudies", caseStudies);
  return updated;
}

export async function deleteCaseStudy(id: string): Promise<void> {
  const caseStudies = await getCaseStudies();
  const filtered = caseStudies.filter((cs) => cs.id !== id);
  if (filtered.length === caseStudies.length) {
    throw createNotFoundError("Case study");
  }
  await writeCollection("caseStudies", filtered);
}

export async function getInsights(): Promise<Insight[]> {
  return readCollection<Insight[]>("insights");
}

export async function createInsight(payload: Omit<Insight, "id"> & Partial<Pick<Insight, "id">>): Promise<Insight> {
  const insights = await getInsights();
  const id = payload.id ?? randomUUID();
  const record: Insight = { ...payload, id } as Insight;
  insights.push(record);
  await writeCollection("insights", insights);
  return record;
}

export async function updateInsight(id: string, payload: Partial<Insight>): Promise<Insight> {
  const insights = await getInsights();
  const index = insights.findIndex((item) => item.id === id);
  if (index === -1) {
    throw createNotFoundError("Insight");
  }
  const updated = { ...insights[index], ...payload, id };
  insights[index] = updated;
  await writeCollection("insights", insights);
  return updated;
}

export async function deleteInsight(id: string): Promise<void> {
  const insights = await getInsights();
  const filtered = insights.filter((item) => item.id !== id);
  if (filtered.length === insights.length) {
    throw createNotFoundError("Insight");
  }
  await writeCollection("insights", filtered);
}

