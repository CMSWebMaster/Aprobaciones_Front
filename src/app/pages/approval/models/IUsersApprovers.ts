export interface IUsersAprrovers {
	TipoDocumento: string;
	CompaniaSocio: string;
	NumeroDocumento: string;
	Secuencia: number;
	CodigoAuxiliar: string;
	Estado: string;
	UltimoUsuario: string;
	UltimaFechaModif: string;
	motivorechazo: string | null;
	CorreoEnviado: string | null;
	Maquina: string | null;
	Persona: string;
	Proveedor: string | null;
	TipoRegistro: string | null;
	Busqueda: string;
}