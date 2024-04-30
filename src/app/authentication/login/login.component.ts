import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
// import { SharedService } from 'src/app/Layout/shared.service';
// import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-boxed',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public profiles: any = [];
  public userslist: any = [];
  public listrol: any = [];
  public acceso = 0;
  loginForm: FormGroup;
  submitted = false;
  showPassword = false;
  message: string;
  subscription: Subscription;
  constructor(private formBuilder: FormBuilder, private router: Router,
    private apiService: AuthService,
    // private sharedService: SharedService,
    // private datePipe: DatePipe
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    // this.subscription = this.sharedService.currentMessage.subscribe(message => this.message = message)
    console.log(100,this.getUserdata());
    console.log(30,localStorage.getItem('username'));

  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    // this.subscription.unsubscribe();
  }
  get f() {

    return this.loginForm.controls;
  }

  onSubmit() {


    localStorage.setItem('title', 'Aplicativo Web')
    // this.sharedService.changeMessage("Aplicativo Web")
    this.submitted = true;
    // this.router.navigate(['/dashboard/dashboard1'])
    // stop here if form is invalid
    this.router.navigate(['dashboard/dashboard1']);
    if (this.loginForm.invalid) {
      return;
    }
    console.log(54, 'object')
    const data = {
      // username: this.f.username.value,
      // password: this.f.password.value,
    };
    // this.loading();
    // this.apiService.postLoginService(data).then(
    //   (response: any) => {
    //     console.log(response);
    //     if (response.respuesta === 'True') {
    //       // this.getProfileUser(this.f.username.value);
    //       // localStorage.setItem('username', this.f.username.value);
    //       localStorage.setItem('valuelogin', '1');

    //     } else {
    //       // Swal.close();
    //       this.errorLogin("Contraseña o usuario incorrecto!");
    //     }
    //   },
    //   (error) => {
    //     // Swal.close();
    //     // Swal.fire('Error!', 'Problemas con la conexión', 'error');
    //   }
    // );
  }
  getProfileUser(username) {
    const data = {
      username: username,
    };
    // this.apiService.getProfileUserService(data).then((response: any) => {

    //   this.profiles = response.length > 0 ? response : [];
    //   var splitted = this.profiles[0]?.Nombres.split(" ", 2);
    //   console.log(89, splitted)
    //   localStorage.setItem('Nombres', splitted[0]);
    //   localStorage.setItem('Apellidos', this.profiles[0]?.Apellidos);
    //   localStorage.setItem('name_area', this.profiles[0]?.DES_AREAS);
    //   localStorage.setItem('cargo', this.profiles[0]?.DES_CARGO);
    //   localStorage.setItem('cod_user', this.profiles[0]?.Persona);
    //   localStorage.setItem('CodigoUsuario', this.profiles[0]?.CodigoUsuario)
    //   localStorage.setItem('id_area', this.profiles[0]?.id_area);
    //   localStorage.setItem('sede', this.profiles[0]?.Sucursal);
    //   if (this.profiles[0]?.id_area === '02060603') {
    //     localStorage.setItem('id_areav2', '20603');
    //   } else {
    //     localStorage.setItem('id_areav2', '0');
    //   }
    //   this.getUserdata()
    //   console.log('profile', this.profiles);
    // });
  }
  getUserdata() {
    // this.apiService.getUserBrIdService(this.profiles[0]?.Persona).then((response: any) => {
    //   this.userslist = response.data.length > 0 ? response.data : [];

    //   if (response.success == 1 && this.userslist.length > 0) {
    //     //console.log(this.userslist)
    //     // Swal.close();
    //     this.getRoles(this.userslist[0]?.idrol, this.profiles[0]?.Persona);
    //     console.log(200,this.getRoles(this.userslist[0]?.idrol, this.profiles[0]?.Persona));
    //     //this.router.navigate(['./dashboard/default']);
    //   }
    //   else {
    //     this.registerUserData();
    //     //this.InfoLogin();
    //     console.log("registro usuario")
    //   }
    // });
  }

  registerUserData() {
    const data = {
      userSpring: this.profiles[0]?.Persona,
      firtname: this.profiles[0]?.Nombres,
      lastname: this.profiles[0]?.Apellidos,
      area: this.profiles[0]?.DES_AREAS,
      idrol: 0,
      // fecha: this.datePipe.transform(new Date(), 'dd-MM-yyyy'),
    }
    // this.apiService.postUserService(data).then((response: any) => {
    //   var lista = response.data.length > 0 ? response.data : [];
    //   if (response.success == 1) {

    //     this.getRoles(lista[0].idrol, this.profiles[0]?.Persona);

    //   }
    // }, (error) => {
    //   // Swal.close();
    //   this.errorLogin("Error en la validacion de datos");
    // });
  }


  getRoles(idrol, persona) {

//     this.apiService.getRolesByService(idrol, persona).then((response: any) => {
//       console.log(86, response)
//       this.listrol = response.data.length > 0 ? response.data : [];
//       localStorage.setItem('token', response.token);
//       if (this.listrol[0]?.special_access == 0) {
//         this.acceso = 0;
//       } else {
//         this.acceso = this.listrol[0]?.special_access
//       }
//       console.log('lista rol', response);
//       // Swal.close();
//       if (response.data.length > 0) {
// // console.log(this.listrol)
//         let claves = Object.keys(this.listrol);
//         var area_access ='';
//         var idrol = '';
//         for(let i=0; i< claves.length; i++){
//           let clave = claves[i];
//           if (claves.length != i + 1){
//             // area_access =  area_access + this.listrol[clave].area_access + ',';
//             idrol =  idrol + this.listrol[clave].idrol + ',';
//           }else{
//             // area_access =  area_access + this.listrol[clave].area_access;
//             idrol =  idrol + this.listrol[clave].idrol;
//           }

//           console.log(111, claves);
//         }
//         console.log(177, this.acceso.toString())
//         localStorage.setItem('access', this.acceso.toString());
//         // localStorage.setItem('access_area', area_access);
//         localStorage.setItem('idrol', idrol);
//         localStorage.setItem('access_area', this.listrol[0]?.area_access);
//         // localStorage.setItem('idrol', this.listrol[0]?.idrol);
//         this.router.navigate(['/default']);
//       } else {
//         this.InfoLogin();
//       }
//     })
  }

  async loading() {
    // Swal.fire({
    //   text: 'Validando ...',
    //   width: '200px',
    //   allowEscapeKey: false,
    //   allowOutsideClick: false,
    //   onOpen: () => {
    //     Swal.showLoading();
    //   },
    // });
  }

  async errorLogin(text) {
    // Swal.fire({
    //   icon: 'error',
    //   title: 'Oops...',
    //   text: text,
    // });
  }

  async InfoLogin() {
    // Swal.fire({
    //   icon: 'info',
    //   title: 'Acceso Denegado...',
    //   text: 'Usted no tiene permisos asignados para la aplicación web!',
    // });
  }

  goStepOne() {
    this.router.navigate(['/auth/step-one']);
  }
  entrarSinLogueo(){
    console.log(224, 'hola')
    this.getProfileUser('royal');
    localStorage.setItem('username', 'royal');
    localStorage.setItem('valuelogin', '1');

    // localStorage.setItem('valuelogin', '0');
    localStorage.setItem('access', '3');
    // localStorage.setItem('access_area', area_access);
    localStorage.setItem('idrol', '32');
    // localStorage.setItem('access_area', '0');
    // localStorage.setItem('idrol', this.listrol[0]?.idrol);
    this.router.navigate(['/default']);
  }
}
