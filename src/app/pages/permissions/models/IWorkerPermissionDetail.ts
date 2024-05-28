export interface IWorkerPermission {
	IdPermiso: number;
	IdColaborador: number;
	Colaborador: string;
	SexoColaborador: string;
	Area: string;
	Justificacion: string;
	FechaDesde: Date;
	FechaHasta: Date;
	EstadoAutorizacion: string;
	FechaAutorizacion: Date;
	UsuarioAutorizacion: string;
}