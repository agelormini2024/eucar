import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        <div className="flex justify-center mt-3 mb-3">
            <div className="relative w-40 h-40">
                <Link href="/">
                    <Image
                        fill
                        alt="Logotipo"
                        src='/logo-eucar.jpg'
                        priority
                    />
                </Link>
            </div>
        </div>
    )
}
