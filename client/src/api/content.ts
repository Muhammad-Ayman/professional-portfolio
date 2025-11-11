import apiClient from "./http";
import type { CaseStudy, ContentData, FAQ, Insight, Profile } from "@shared/content";

export async function fetchContent() {
  const { data } = await apiClient.get<ContentData>("/content");
  return data;
}

export async function fetchProfile() {
  const { data } = await apiClient.get<Profile>("/content/profile");
  return data;
}

export async function fetchCaseStudies() {
  const { data } = await apiClient.get<CaseStudy[]>("/content/case-studies");
  return data;
}

export async function fetchInsights() {
  const { data } = await apiClient.get<Insight[]>("/content/insights");
  return data;
}

export async function fetchFAQs() {
  const { data } = await apiClient.get<FAQ[]>("/content/faqs");
  return data;
}

