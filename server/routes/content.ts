import { Router } from "express";
import {
  createCaseStudy,
  createInsight,
  deleteCaseStudy,
  deleteInsight,
  getAllContent,
  getCaseStudies,
  getInsights,
  getProfile,
  updateCaseStudy,
  updateInsight,
  updateProfile,
} from "../contentStore";
import { CaseStudy, Insight, Profile } from "../../shared/content";
import { caseStudySchema, insightSchema, profileSchema } from "../validation";
import { parseValidation } from "../utils/validation";
import { requireAdminToken } from "../middleware/auth";

const contentRouter = Router();

contentRouter.get("/", async (_req, res, next) => {
  try {
    const content = await getAllContent();
    res.json(content);
  } catch (error) {
    next(error);
  }
});

contentRouter.get("/profile", async (_req, res, next) => {
  try {
    const profile = await getProfile();
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

contentRouter.put("/profile", requireAdminToken, async (req, res, next) => {
  try {
    const payload = parseValidation(profileSchema, req.body) as Profile;
    const updated = await updateProfile(payload);
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

contentRouter.get("/case-studies", async (_req, res, next) => {
  try {
    const caseStudies = await getCaseStudies();
    res.json(caseStudies);
  } catch (error) {
    next(error);
  }
});

contentRouter.post("/case-studies", requireAdminToken, async (req, res, next) => {
  try {
    const payload = parseValidation(caseStudySchema, req.body) as CaseStudy;
    const created = await createCaseStudy(payload);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

contentRouter.put("/case-studies/:id", requireAdminToken, async (req, res, next) => {
  try {
    const payload = parseValidation(caseStudySchema.partial(), req.body) as Partial<CaseStudy>;
    const updated = await updateCaseStudy(req.params.id, payload);
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

contentRouter.delete("/case-studies/:id", requireAdminToken, async (req, res, next) => {
  try {
    await deleteCaseStudy(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

contentRouter.get("/insights", async (_req, res, next) => {
  try {
    const insights = await getInsights();
    res.json(insights);
  } catch (error) {
    next(error);
  }
});

contentRouter.post("/insights", requireAdminToken, async (req, res, next) => {
  try {
    const payload = parseValidation(insightSchema, req.body) as Insight;
    const created = await createInsight(payload);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

contentRouter.put("/insights/:id", requireAdminToken, async (req, res, next) => {
  try {
    const payload = parseValidation(insightSchema.partial(), req.body) as Partial<Insight>;
    const updated = await updateInsight(req.params.id, payload);
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

contentRouter.delete("/insights/:id", requireAdminToken, async (req, res, next) => {
  try {
    await deleteInsight(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default contentRouter;

