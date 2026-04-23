import AppNav from "@/components/AppNav";

export default function SimulationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNav />
      {children}
    </>
  );
}
