"use client";
import { ReciboConRelaciones } from '@/src/types/recibo';
import { Page, Text, View, Document, StyleSheet, Svg, G, Polygon, Text as SvgText } from '@react-pdf/renderer';
import { numeroALetras } from '@/src/utils';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 11,
        lineHeight: 1.4
    },
    header: {
        flexDirection: 'row',
        marginBottom: 30,
        borderBottom: '2 solid #000000',
        paddingBottom: 20
    },
    logoSection: {
        flex: 1,
        alignItems: 'flex-start'
    },
    logo: {
        width: 80,
        height: 80
    },
    companySection: {
        flex: 2,
        alignItems: 'flex-end',
        paddingLeft: 20
    },
    companyName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000000'
    },
    companyInfo: {
        fontSize: 10,
        marginBottom: 2,
        textAlign: 'right',
        color: '#333333'
    },
    titleSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 10
    },
    receiptTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000'
    },
    locationDate: {
        fontSize: 12,
        color: '#666666'
    },
    content: {
        marginBottom: 20
    },
    detailSection: {
        marginTop: 8,
        marginBottom: 8,
        borderTop: '1 solid #EEEEEE',
        paddingTop: 8
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4
    },
    detailLeft: {
        fontSize: 11,
        color: '#333333'
    },
    detailRight: {
        fontSize: 11,
        color: '#000000',
        fontWeight: 'bold'
    },
    paragraph: {
        marginBottom: 15,
        textAlign: 'justify',
        lineHeight: 1.5
    },
    bold: {
        fontWeight: 'bold'
    },
    amount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000'
    },
    footer: {
        marginTop: 40,
        borderTop: '1 solid #CCCCCC',
        paddingTop: 20,
        fontSize: 10,
        color: '#666666',
        textAlign: 'center'
    }
});

type PDFReciboProps = {
    recibo: ReciboConRelaciones
}

export default function PDFRecibo({ recibo }: PDFReciboProps) {
    // Formatear fecha actual
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Formatear fecha del recibo para el período
    const fechaRecibo = recibo.fechaGenerado ? new Date(recibo.fechaGenerado) : fechaActual;
    const mesRecibo = fechaRecibo.toLocaleDateString('es-AR', { month: 'long' });
    const anioRecibo = fechaRecibo.getFullYear();

    // Determinar tipo de recibo
    const tipoRecibo = recibo.estadoReciboId === 1 ? "RECIBO PROVISORIO" : "RECIBO OFICIAL";

    // Nota: el logo se renderiza vectorialmente abajo con componentes Svg

    // Formatear dirección completa
    const direccionCompleta = [
        recibo.contrato.propiedad.calle,
        recibo.contrato.propiedad.numero,
        recibo.contrato.propiedad.piso,
        recibo.contrato.propiedad.departamento
    ].filter(Boolean).join(' ');

    // Convertir monto a letras
    const montoEnLetras = numeroALetras(recibo.montoPagado);

    // Nombre completo del inquilino
    const inquilinoCompleto = `${recibo.contrato.clienteInquilino.apellido} ${recibo.contrato.clienteInquilino.nombre}`;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header con logo y datos de la empresa */}
                <View style={styles.header}>
                    <View style={styles.logoSection}>
                        {/* Dibujar logo SVG directamente con componentes de react-pdf (vectorial) */}
                        <Svg width={120} height={80} viewBox="0 0 300 200">
                            <G transform="translate(120, 20)">
                                <G>
                                    <Polygon points="70,0 80,5 80,20 70,15" fill="#B85450" />
                                    <Polygon points="0,15 70,15 80,20 10,20" fill="#A04540" />
                                </G>
                                <G>
                                    <Polygon points="70,30 80,35 80,50 70,45" fill="#B85450" />
                                    <Polygon points="0,45 70,45 80,50 10,50" fill="#A04540" />
                                </G>
                                <G>
                                    <Polygon points="70,60 80,65 80,80 70,75" fill="#B85450" />
                                    <Polygon points="0,75 70,75 80,80 10,80" fill="#A04540" />
                                </G>
                                <G>
                                    <Polygon points="70,90 80,95 80,110 70,105" fill="#B85450" />
                                    <Polygon points="0,105 70,105 80,110 10,110" fill="#A04540" />
                                </G>
                            </G>
                            {/* Leyenda textual del logo */}
                            <SvgText x={50} y={165} style={{ fontSize: 24, fill: '#333333' }}>SOARES PARENTE</SvgText>
                            <SvgText x={50} y={185} style={{ fontSize: 14, fill: '#666666' }}>PROPIEDADES</SvgText>
                        </Svg>
                    </View>
                    <View style={styles.companySection}>
                        <Text style={styles.companyName}>SOARES PARENTE PROPIEDADES</Text>
                        <Text style={styles.companyInfo}>Formosa 44 (C1424BZB) Buenos Aires</Text>
                        <Text style={styles.companyInfo}>Tel: 4902-1243    4903-4557</Text>
                        <Text style={styles.companyInfo}>Horarios de Atención:</Text>
                        <Text style={styles.companyInfo}>Lunes a Viernes 10:00 a 13:00 y 15:00 a 19:00 hs</Text>
                    </View>
                </View>

                {/* Título y fecha */}
                <View style={styles.titleSection}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Text style={styles.receiptTitle}>{tipoRecibo}</Text>
                        <Text style={styles.receiptTitle}>N° {recibo.id.toString().padStart(8, '0')}</Text>
                    </View>
                </View>
                <View style={{ marginBottom: 20, paddingBottom: 10, borderBottom: '1 solid #CCCCCC' }}>
                    <Text style={styles.locationDate}>Buenos Aires, {fechaFormateada}</Text>
                </View>

                {/* Contenido principal */}
                <View style={styles.content}>
                    <Text style={styles.paragraph}>
                        Recibimos de <Text style={styles.bold}>{inquilinoCompleto}</Text> la suma de <Text style={styles.bold}>{montoEnLetras}</Text> por el pago del alquiler del inmueble <Text style={styles.bold}>{recibo.contrato.propiedad.tipoPropiedad?.descripcion || 'inmueble'}</Text> ubicado en <Text style={styles.bold}>{direccionCompleta}</Text>, correspondiente al mes de <Text style={styles.bold}>{mesRecibo} {anioRecibo}</Text>.
                    </Text>

                    {/* Sección de detalle: items del recibo */}
                    <View style={styles.detailSection}>
                        {recibo.itemsRecibo && recibo.itemsRecibo.length > 0 ? (
                            recibo.itemsRecibo.map((item, index) => (
                                <View key={item.id || index} style={styles.detailRow}>
                                    <Text style={styles.detailLeft}>{item.descripcion}</Text>
                                    <Text style={styles.detailRight}>
                                        $ {item.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLeft}>Alquiler {mesRecibo} {anioRecibo}</Text>
                                <Text style={styles.detailRight}>$ {recibo.montoTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</Text>
                            </View>
                        )}
                        
                        {/* Línea separadora antes del total */}
                        <View style={{ borderTop: '1 solid #333333', marginTop: 8, paddingTop: 8 }}>
                            <View style={styles.detailRow}>
                                <Text style={[styles.detailLeft, styles.bold]}>TOTAL</Text>
                                <Text style={[styles.detailRight, { fontSize: 13 }]}>
                                    $ {recibo.montoPagado.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Text style={[styles.paragraph, styles.amount]}>
                        Monto: $ {recibo.montoPagado.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </Text>

                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Este recibo certifica el pago del alquiler correspondiente al período indicado.</Text>
                </View>
            </Page>
        </Document>
    );
}
