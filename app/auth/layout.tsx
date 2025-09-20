export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl py-12 px-6">
        {children}
      </div>
    </div>
  );
}