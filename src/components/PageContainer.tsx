export function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen p-4 max-w-128 mb-16">
      {children}
    </div>
  );
}
