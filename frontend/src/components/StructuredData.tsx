import { buildOrganizationSchema, buildPersonStructuredData } from "@/lib/seo";
import { useProfile } from "@/hooks/useContent";

export default function StructuredData() {
  const { data: profile } = useProfile();
  const personData = buildPersonStructuredData(profile);
  const organizationData = buildOrganizationSchema(profile);

  return (
    <>
      {/* Person Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personData),
        }}
      />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />
    </>
  );
}

