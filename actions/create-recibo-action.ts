"use server"
import { ReciboSchema } from "@/src/schema"



export async function createRecibo(data: unknown) {
        const result = ReciboSchema.safeParse(data)
        
        if (!result.success) {
        return {
            errors: result.error.issues
        }
    }
    
    


    
}