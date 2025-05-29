This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Calculos en la usados en aplicacion

## ICL
Calcular el ICL acumulado tomando como ejemplo los últimos 6 meses

    * Formula de ICL Semestral
    
    Supongamos:

    Contrato firmado el 1 de enero de 2024
    Ajuste a los 6 meses, o sea: 1 de julio de 2024
    Alquiler inicial: $1000

        ICL del 01/01/2024: 1.123456
        ICL del 01/07/2024: 1.234567

    Formula:

        Alquiler ajustado = 1000 × ( 1.123456 / 1.234567 ) ≈ 1000 × 1.099 ≈ 1099

    ✅ Resultado:
    El nuevo alquiler a partir del 1 de julio de 2024 sería $1099 
    Es decir que el porcentaje de aumento fué del 9.9 %           

## IPC

Formula de IPC Anual
Paso 1: Convertir los porcentajes a coeficientes
Para poder multiplicar el valor, transformamos cada porcentaje en su factor decimal:

Ejemplo:
IPC últimos 3 meses:
    Mes 1: 2.4%
    Mes 2: 3.73%
    Mes 3: 2.78%

    ✅ Paso 1: Convertir los porcentajes a coeficientes

    Mes 1 = 1 + 2.4% = 1.024
    Mes 2 = 1 + 3.73% = 1.0373
    Mes 3 = 1 + 2.78% = 1.0278
​
    
    ✅ Paso 2: Calcular el coeficiente acumulado
    
    Multiplicamos todos los factores:
    Factor acumulado = 1.024 × 1.0373 × 1 .0278 ≈ 1.091

    ✅ Paso 3: Calcular el nuevo valor del alquiler
    
    Nuevo alquiler=$1000 × 1.091 = $ 1091

