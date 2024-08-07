export interface IApprovalOrder {
	Nombre: string;
	CodigoUsuario: string;
	DescripcionLocal: string;
	TipoCompromiso: string;
	NumeroCompromiso: string;
	CodigoInterno: string | null;
	CompaniaCodigo: string;
	UnidadNegocio: string;
	Proveedor: string;
	MonedaDocumento: string;
	MonedaPago: string;
	TipoPago: string;
	FormadePago: string;
	FechaEntrega: string;
	FechaDocumento: string;
	DiasparaPago: number;
	TipodeServicio: string;
	TipodeServiciocxp: string;
	TipodeCotizacion: string;
	MontoCompromisoOriginal: string;
	MontoCompromiso: string;
	MontoImpuesto: string;
	MontoGastado: string;
	ProvisionTipoFlag: string;
	FechaPreparacion: string;
	FechaAprobacion: string;
	PreparadaPor: number;
	AprobadaPor: number;
	EstadoCompromiso: string;
	ImpresionNumero: number;
	ContraPrestacionFlag: string;
	CPPendienteFlag: string;
	Periodicidad: string | null;
	PeriodoAplicacion: string | null;
	PrecioUnitario: string | null;
	Comentarios: string;
	UltimaFechaModif: string;
	UltimoUsuario: string;
	Descripcion: string;
	Busqueda: string;
	RazonRechazo: string | null;
	Observaciones: string | null;
	NumeroContrato: string | null;
	FechaEnvioProveedor: string | null;
	Clasificacion: string;
	NumeroOrden: string;
	Compromiso: string;
}