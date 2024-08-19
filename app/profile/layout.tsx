import React from "react";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        //  h-screen
        <div className="flex min-h-screen justify-center items-center overflow-auto bg-white">
            <div className="w-full max-w-[90%] md:max-w-lg">
                <div>{children}</div>
            </div>
        </div>
    );
}