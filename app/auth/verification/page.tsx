'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import EnterCodeForm from './components/EnterCodeForm';
import EnterEmailForm from './components/EnterEmailForm';
import { useRouter } from 'next/navigation';

export default function VerificationPage() {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [type, setType] = useState<string | null>(null);
    const [updateData, setUpdateData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const userData = sessionStorage.getItem('userData');
        if (!userData) {
            router.push('/auth/login');
        } else {
            // Parse userData and set state accordingly
            const parsedUserData = JSON.parse(userData);
            setEmail(parsedUserData.email || '');
            setType(parsedUserData.type || null);
            setUpdateData(parsedUserData.data || null);
        }

        setIsLoading(false);
    }, [router]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <div className="items-center">
                <Image
                    src="/images/logo.svg"
                    alt="Investrio"
                    width={225}
                    height={53}
                    className={"mx-auto size-64 mt-[-10rem]"}
                />
            </div>
            {email === '' ? (
                <EnterEmailForm email={email} type={type!} setEmail={setEmail} />
            ) : (
                <EnterCodeForm email={email} type={type!} updateData={updateData} />
            )}
        </>
    );
}