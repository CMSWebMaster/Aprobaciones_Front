export interface IWorkerPermission {
	IdColaborador: number;
	Colaborador: string;
	SexoColaborador: string;
	Area: string;
	Justificacion: string;
	FechaDesde: Date;
	FechaHasta: Date;
	HoraDesde: Date;
	HoraHasta: Date;
	EstadoAutorizacion: string;
	FechaAutorizacion: Date;
	UsuarioAutorizacion: string;
}