export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col min-h-screen p-4 max-w-128 pb-24 ${className}`}
    >
      {children}
    </div>
  );
}
