
// Components
import Image from 'next/image';
import { LogoutButton } from '@/components/LogoutButton';

// Hooks
import { auth } from '@/auth'
import { redirect } from 'next/navigation';

const Page = async () => {
    const session = await auth();

    if (!session?.user) redirect('/auth/login');

    return (
        <div className='flex flex-col items-center m-4'>
            {(session.user.name && session.user.image) ?
                (
                    <>
                        <h1 className='text-3xl my-2'>{session.user.name}</h1>
                        <Image
                            className='rounded-full'
                            alt={session.user.name as string}
                            src={session.user.image as string}
                            width={72}
                            height={72}
                        />
                        <LogoutButton />
                    </>
                )
                :
                (
                    <>
                        <h1 className='text-3xl my-2'>{session.user.email}</h1>
                        <LogoutButton />
                    </>
                )}

        </div>
    )
}

export default Page
