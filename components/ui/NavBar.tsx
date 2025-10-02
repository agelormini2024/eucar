import { getServerSession } from 'next-auth/next'
import ButtonLogout from "./ButtonLogout";
import { authOptions } from "@/src/auth/options";
import ButtonGoHome from "./ButtonGoHome";
import ButtonInvitaciones from "./ButtonInvitaciones";

export default async function NavBar() {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions) as any // Casting temporal

    return (
        <nav className="flex justify-between p-4">
            <ul className="flex space-x-4">
                {session?.user ? (
                    <>
                        <li className="flex space-x-2">
                            <ButtonGoHome />
                            {session.user.rol === "admin" && (
                                <ButtonInvitaciones />
                            )}
                            <ButtonLogout />
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <p className="text-sm font-bold">Soares Parente Propiedades</p>                        </li>
                        <li>
                            <p className="text-sm">v.1.0.1</p>
                        </li>
                    </>
                )
                }
            </ul>
        </nav>
    )
}
