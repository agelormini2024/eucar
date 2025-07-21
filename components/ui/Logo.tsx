import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (

        <div className="flex mt-1">
            <Link href="/">
                <div className="relative w-56 h-36">
                    <Image
                        fill
                        alt="Logotipo"
                        src='/logo.svg'
                        priority={true}
                    />
                </div>
            </Link>
        </div>
    )
}
