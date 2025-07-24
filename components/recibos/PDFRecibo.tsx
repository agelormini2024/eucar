"use client";
import { ReciboConRelaciones } from '@/src/types';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 30,
        flexGrow: 1
    }
});
type PDFReciboProps = {
    recibo: ReciboConRelaciones
}
export default function PDFRecibo({ recibo }: PDFReciboProps) {
    return (

        < Document >
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Recibo ID: {recibo.id}</Text>
                    <Text>Inquilino: {`${recibo.contrato.clienteInquilino.apellido} ${recibo.contrato.clienteInquilino.nombre}`}</Text>
                    <Text>Propiedad: {`${recibo.contrato.propiedad.calle} ${recibo.contrato.propiedad.numero}`}</Text>
                    <Text>Monto Total: $ {recibo.montoTotal ? recibo.montoTotal : recibo.montoAnterior}</Text>
                </View>
            </Page>
        </Document >


    )
}
