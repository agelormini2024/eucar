import Link from "next/link";
import { getServerSession } from 'next-auth/next'
import ButtonLogout from "./ButtonLogout";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export default async function NavBar() {

    const session = await getServerSession(authOptions)

    return (
        <nav className="flex justify-between p-4">
            <ul className="flex space-x-4">
                {session?.user ? (
                    <>
                        <li>
                            <ButtonLogout />
                        </li>

                    </>
                ) : (
                    <>
                        <li>
                            <Link href="/auth/login"
                                className="text-red-900 font-bold hover:underline">
                                Login
                            </Link>
                        </li>
                        {/* <li>
                            <Link href="/auth/register"
                                className="text-red-900 font-bold hover:underline"                                >
                                Registrarse
                            </Link>
                        </li> */}
                    </>
                )
                }
            </ul>
        </nav>
    )
}
