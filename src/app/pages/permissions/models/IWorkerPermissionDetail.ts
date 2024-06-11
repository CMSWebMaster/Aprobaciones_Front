export interface IWorkerPermission {
	IdPermiso: number;
	IdColaborador: number;
	Colaborador: string;
	SexoColaborador: string;
	Area: string;
	Justificacion: string;
	FechaDesde: string;
	FechaHasta: string;
	IndicadorEstado: string;
	FechaCreacion: Date;
	UsuarioCreacion: string;
	FechaAprueba: Date;
	UsuarioAprobador: string;
	FechaRechaza: Date;
	UsuarioRechaza: string;
	CodUsuarioAprobador: string;
	MotivoCodigo: number;
	SedeCodigo: string;
}