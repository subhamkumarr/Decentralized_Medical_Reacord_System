import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentComponent } from './appointment/appointment.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ContactComponent } from './contact/contact.component';
import { SecComponent } from './sec/sec.component';
import { GetstartComponent } from './getstart/getstart.component';
// import { FooterComponent } from './footer/footer.component';
// import { ServiceeComponent } from './servicee/servicee.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'service', component: SecComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'getstart', component: GetstartComponent },
  {
    path: 'appointment',
    component: AppointmentComponent,
  },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('../admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'doctor',
    loadChildren: () =>
      import('../doctor/doctor.module').then((m) => m.DoctorModule),
  },
  {
    path: 'patient',
    loadChildren: () =>
      import('../patient/patient.module').then((m) => m.PatientModule),
  },
  { path: '**', component: HomeComponent, redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
