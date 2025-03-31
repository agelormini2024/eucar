import ClienteForm from "./ClienteForm";

export default function AddClienteForm() {
    return (
        <div className='bg-white shadow-xl mt-10 px-5 py-10 rounded-md max-w-5xl mx-auto'>
            <form
                className="space-y-5"
            // action={handleSubmit}
            >
                {/* {children} */}

                <ClienteForm />

                <input
                    type="submit"
                    className='bg-red-800 hover:bg-red-600 text-white p-3 rounded-md w-full 
                    cursor-pointer font-bold uppercase mt-5'
                    value="Crear Cliente"
                />
            </form>
        </div>
    )
}
