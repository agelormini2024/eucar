import { getServerSession } from 'next-auth/next'
import ButtonLogout from "./ButtonLogout";
import { authOptions } from "@/src/auth/options";
import ButtonGoHome from "./ButtonGoHome";
import ButtonInvitaciones from "./ButtonInvitaciones";
import ButtonProfile from "./ButtonProfile";
import packageJson from "@/package.json";

export default async function NavBar() {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions) as any // Casting temporal
    const appVersion = packageJson.version

    return (
        <nav className="flex justify-between items-center p-4">
            <ul className="flex space-x-4">
                {session?.user ? (
                    <>
                        <li className="flex space-x-2">
                            <ButtonGoHome />
                            {session.user.rol === "admin" && (
                                <ButtonInvitaciones />
                            )}
                            <ButtonProfile />
                            <ButtonLogout />
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <p className="text-sm font-bold">Soares Parente Propiedades</p>
                        </li>
                    </>
                )
                }
            </ul>
            
            {/* Versión de la aplicación - visible siempre */}
            <div className="text-xs text-gray-900 ml-8">
                v{appVersion}
            </div>
        </nav>
    )
}
