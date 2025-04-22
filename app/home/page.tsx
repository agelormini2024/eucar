import Heading from "@/components/ui/Heading";
import MenuBar from "@/components/home/MenuBar";
import Logo from "@/components/ui/Logo";


export default function homePage() {
    return (
        <>
            <div className="flex justify-between items-center px-10">
                <div>
                    <Logo />
                </div>
                <div>
                    <Heading />
                </div>
            </div>

            <div className="relative bg-cover bg-center bg-no-repeat h-screen" style={{ backgroundImage: "url('exterior.jpg')" }}>

                <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-transparent">

                    <div >
                        <div className="md:w-full">
                            <div >
                                <MenuBar />
                            </div>
                        </div>
                    </div>
                </div> 

            </div>
        </>

    )
}
