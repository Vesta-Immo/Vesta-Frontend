// filepath: components/projects/ProjectsSkeleton.tsx
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function ProjectsSkeleton() {
  return (
    <Stack spacing={2}>
      {[1, 2, 3].map((i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          height={100}
          sx={{ borderRadius: 2 }}
        />
      ))}
    </Stack>
  );
}
