import MenuBar from "@/components/home/MenuBar";
import Logo from "@/components/ui/Logo";


export default function homePage() {
    return (
        <>
            <div className="relative bg-cover bg-center bg-no-repeat h-screen" style={{ backgroundImage: "url('exterior.jpg')" }}>

                <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-transparent">

                    <main >
                        <div className="md:w-full">
                            <div >
                                <MenuBar />
                            </div>
                        </div>
                    </main>
                </div>

            </div>
        </>

    )
}
