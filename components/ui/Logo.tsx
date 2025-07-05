import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        <div className="flex justify-center mt-1">
            <Link href="/">
                <div className="relative w-60 h-40">
                    <Image
                        fill
                        alt="Logotipo"
                        src='/logo.svg'
                    />
                </div>
            </Link>
        </div>
    )
}
