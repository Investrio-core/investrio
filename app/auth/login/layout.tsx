export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* h-screen min-h-screen */}
      <div className="flex min-h-screen justify-center items-center overflow-auto bg-violet-50">
        <div className="w-full max-w-[90%] md:max-w-lg">
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
