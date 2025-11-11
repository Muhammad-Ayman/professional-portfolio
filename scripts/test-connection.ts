#!/usr/bin/env tsx
/**
 * Test Database Connection
 * 
 * Verifies that the Prisma connection works and data is accessible
 * Usage: pnpm tsx scripts/test-connection.ts
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  console.log("🔍 Testing database connection...\n");

  try {
    // Test connection
    await prisma.$connect();
    console.log("✅ Database connection successful!");

    // Test profile
    const profile = await prisma.profile.findUnique({ where: { id: "profile" } });
    if (profile) {
      console.log(`✅ Profile found: ${profile.name}`);
    } else {
      console.log("⚠️  Profile not found");
    }

    // Test case studies
    const caseStudiesCount = await prisma.caseStudy.count();
    console.log(`✅ Case studies: ${caseStudiesCount} records`);

    // Test insights
    const insightsCount = await prisma.insight.count();
    console.log(`✅ Insights: ${insightsCount} records`);

    console.log("\n🎉 All tests passed! Database is working correctly.");
  } catch (error: any) {
    console.error("\n❌ Test failed:", error.message);
    console.error("\nTroubleshooting:");
    console.error("1. Check DATABASE_URL in .env file");
    console.error("2. Ensure database is accessible");
    console.error("3. Run: pnpm prisma migrate dev");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

test();

