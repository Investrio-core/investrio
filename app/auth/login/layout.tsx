export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-screen min-h-screen items-center justify-center overflow-auto bg-slate-200">
        <div className="w-full max-w-[90%] md:max-w-lg">
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
