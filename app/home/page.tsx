import MenuBar from "@/components/home/MenuBar";


export default function homePage() {
    return (
        <>
            <div className="relative bg-cover bg-center bg-no-repeat h-screen" style={{ backgroundImage: "url('exterior.jpg')" }}>

                <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-transparent">

                    <main className="md:w-full">
                        <MenuBar />
                    </main>
                </div>

            </div>
        </>

    )
}
