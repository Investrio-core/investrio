export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-screen min-h-screen justify-center overflow-auto bg-violet-50">
        <div className="w-full max-w-[90%] md:max-w-lg">
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
