"use client"
import IndicesForm from '@/components/contratos/IndicesForm'
import React, { useEffect } from 'react'

export default function IndicePage() {
    return (
        <>
            <div className='flex flex-col gap-4'>
                <h1 className='text-2xl font-bold'>Indices</h1>
            </div>
            <div className='bg-white max-w-sm mx-auto'>
                <IndicesForm/>
            </div>
        </>
    )
}
