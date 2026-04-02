// filepath: app/simulation/projects/[projectId]/compare/page.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const idsParam = searchParams.get("ids");
    const target = idsParam
      ? `/simulation/projects/compare?ids=${encodeURIComponent(idsParam)}`
      : "/simulation/projects/compare";
    router.replace(target);
  }, [router, searchParams]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography color="text.secondary">
        Redirection vers la comparaison de scénarios...
      </Typography>
    </Container>
  );
}
