import ButtonGoBack from '@/components/ui/ButtonGoBack'
import Headers from '@/components/ui/Headers'
import Heading from '@/components/ui/Heading'
import React from 'react'

export default function RecibosPage() {
      return (
          <>
              <div className="flex justify-between">
                  <div>
                      <Headers>Administración de Alquileres</Headers>
                  </div>
                  <div>
                      <ButtonGoBack />
                  </div>
  
              </div>
              <div>
                  <Heading />
              </div>
          </>
      )
  
}
