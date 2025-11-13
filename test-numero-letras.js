// Test rápido de la función numeroALetras
const { numeroALetras } = require('./src/utils/index.ts');

// Casos de prueba
const testCases = [
    123.45,
    1000000,
    950527,
    0,
    1,
    100,
    1234,
    999999.99
];

console.log('Pruebas de la función numeroALetras:');
console.log('=====================================');

testCases.forEach(numero => {
    try {
        const resultado = numeroALetras(numero);
        console.log(`${numero} → ${resultado}`);
    } catch (error) {
        console.log(`Error con ${numero}: ${error.message}`);
    }
});