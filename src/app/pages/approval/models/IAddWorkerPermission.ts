export interface IAddWorkerPermission {
	IdColaborador: number;
	IdArea: string;
	CodSede: string;
	CodMotivo: string;
	FechaDesde: Date;
	FechaHasta: Date;
	HoraDesde: string;
	HoraHasta: string;
	Justificacion: string;
	CodUserRegistro: number;
	IndicadorEstado: string;
}