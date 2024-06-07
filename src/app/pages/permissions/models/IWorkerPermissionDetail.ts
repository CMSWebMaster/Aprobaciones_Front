export interface IWorkerPermission {
	IdPermiso: number;
	IdColaborador: number;
	Colaborador: string;
	SexoColaborador: string;
	Area: string;
	Justificacion: string;
	FechaDesde: Date;
	FechaHasta: Date;
	IndicadorEstado: string;
	FechaCreacion: Date;
	UsuarioCreacion: string;
	FechaAprueba: Date;
	UsuarioAprobador: string;
	FechaRechaza: Date;
	UsuarioRechaza: string;
	CodUsuarioAprobador: number;
}