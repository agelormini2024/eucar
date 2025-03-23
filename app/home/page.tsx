import Heading from "@/components/ui/Heading";
import MenuBar from "@/components/home/MenuBar";


export default function homePage() {
    return (
        <>
            <div >
                <Heading />
            </div>
            <div >
                <div className="md:w-full">
                    <div >
                        <MenuBar />
                    </div>
                </div>

            </div>

        </>

    )
}
