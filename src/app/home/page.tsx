import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/LogoutButton'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/Avatar'
import { getGreetingByTime } from '@/utils/time'

export default async function HomePage() {
    const session = await auth()
    const user = session?.user

    if (!user) redirect('/auth/login')

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <Card className="mx-auto max-w-md bg-white shadow-lg">
                <CardHeader className="items-center space-y-4 border-b pb-6">
                    <Avatar className="h-24 w-24">
                        {user.image && (
                            <AvatarImage
                                src={user.image}
                                alt={`Avatar de ${user.name}`}
                                width={96}
                                height={96}
                                className="border-2 border-primary"
                            />
                        )}
                        <AvatarFallback className="bg-indigo-100 text-3xl font-semibold text-indigo-600">
                            {user.name ? user.name[0] : user.email?.[0]}
                        </AvatarFallback>
                    </Avatar>

                    <div className="text-center">
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            {getGreetingByTime()} {user.name || user.email}
                        </CardTitle>
                        {user.name && user.email && (
                            <p className="mt-1 text-sm text-gray-600">{user.email}</p>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-4 p-6">
                    <div className="space-y-2 text-sm">
                        {user.name && (
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Nombre:</span>
                                <span className="text-gray-800">{user.name}</span>
                            </div>
                        )}

                        {user.email && (
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Email:</span>
                                <span className="text-gray-800">{user.email}</span>
                            </div>
                        )}

                        {session.expires && (
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Sesión expira:</span>
                                <span className="text-gray-800">
                                    {new Date(session.expires).toLocaleDateString('es-ES', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <LogoutButton className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
