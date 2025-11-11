import { useQuery } from "@tanstack/react-query";
import { fetchCaseStudies, fetchContent, fetchFAQs, fetchInsights, fetchProfile } from "@/api/content";

const STALE_TIME = 1000 * 60 * 5;

export function useContent() {
  return useQuery({
    queryKey: ["content"] as const,
    queryFn: fetchContent,
    staleTime: STALE_TIME,
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["content", "profile"] as const,
    queryFn: fetchProfile,
    staleTime: STALE_TIME,
  });
}

export function useCaseStudies() {
  return useQuery({
    queryKey: ["content", "caseStudies"] as const,
    queryFn: fetchCaseStudies,
    staleTime: STALE_TIME,
  });
}

export function useInsights() {
  return useQuery({
    queryKey: ["content", "insights"] as const,
    queryFn: fetchInsights,
    staleTime: STALE_TIME,
  });
}

export function useFAQs() {
  return useQuery({
    queryKey: ["content", "faqs"] as const,
    queryFn: fetchFAQs,
    staleTime: STALE_TIME,
  });
}

