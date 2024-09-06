import React from "react";

export default function VerificationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        //  h-screen
        <div className="flex min-h-[91vh] justify-center items-center overflow-auto bg-white">
            <div className="w-full flex justify-center items-center">
                <div>{children}</div>
            </div>
        </div>
    );
}