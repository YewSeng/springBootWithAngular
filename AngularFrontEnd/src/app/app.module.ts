import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainFrameComponent } from './main-frame/main-frame.component';
import { IndexComponent } from './index/index.component';
import { HomeComponent } from './home/home.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { RegisterComponent } from './register/register.component';
import { HiddenComponent } from './hidden/hidden.component';
import { DriverDashboardComponent } from './driver-dashboard/driver-dashboard.component';
import { SuperadminDashboardComponent } from './superadmin-dashboard/superadmin-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './controller-calls/auth.guard';
import { SuperadminViewEnquiriesComponent } from './superadmin-view-enquiries/superadmin-view-enquiries.component';
import { SuperadminCreateAdminComponent } from './superadmin-create-admin/superadmin-create-admin.component';
import { SuperadminViewAdminsComponent } from './superadmin-view-admins/superadmin-view-admins.component';
import { SuperadminUpdateAdminComponent } from './superadmin-update-admin/superadmin-update-admin.component';
import { AdminCreateUserComponent } from './admin-create-user/admin-create-user.component';
import { AdminCreateDriverComponent } from './admin-create-driver/admin-create-driver.component';
import { AdminCreateBookingComponent } from './admin-create-booking/admin-create-booking.component';
import { AdminViewUsersComponent } from './admin-view-users/admin-view-users.component';
import { AdminViewDriversComponent } from './admin-view-drivers/admin-view-drivers.component';
import { AdminViewBookingsComponent } from './admin-view-bookings/admin-view-bookings.component';
import { AdminUpdateUserComponent } from './admin-update-user/admin-update-user.component';
import { AdminUpdateDriverComponent } from './admin-update-driver/admin-update-driver.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminUpdateBookingComponent } from './admin-update-booking/admin-update-booking.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DriverProfileComponent } from './driver-profile/driver-profile.component';
import { UserCreateBookingComponent } from './user-create-booking/user-create-booking.component';
import { UserViewBookingsComponent } from './user-view-bookings/user-view-bookings.component';
import { DriverViewBookingsComponent } from './driver-view-bookings/driver-view-bookings.component';
import { UserUpdateUserComponent } from './user-update-user/user-update-user.component';
import { DriverUpdateDriverComponent } from './driver-update-driver/driver-update-driver.component';
import { UserUpdateBookingComponent } from './user-update-booking/user-update-booking.component';

const routes:Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  {path: 'home', component: HomeComponent},
  {path: 'main-frame', component: MainFrameComponent},
  {
    path: 'user', 
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
    data: {requiredRole: 'user'}
  },
  {
    path: 'user/viewProfile/:id', 
    component: UserProfileComponent,
    canActivate: [AuthGuard],
    data: {requiredRole: 'user'}
  },
  {
    path: 'user/editUser/:id', 
    component: UserUpdateUserComponent,
    canActivate: [AuthGuard],
    data: {requiredRole: 'user'}
  },
  {
    path: 'user/createBooking', 
    component: UserCreateBookingComponent,
    canActivate: [AuthGuard],
    data: {requiredRole: 'user'}
  },
  {
    path: 'user/viewBookings/:id', 
    component: UserViewBookingsComponent,
    canActivate: [AuthGuard],
    data: {requiredRole: 'user'}
  },
  {
    path: 'user/editBooking/:bookingId', 
    component: UserUpdateBookingComponent,
    canActivate: [AuthGuard],
    data: {requiredRole: 'user'}
  },
  {
    path: 'driver', 
    component: DriverDashboardComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'driver' }
  },
  {
    path: 'driver/viewProfile/:id', 
    component: DriverProfileComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'driver' }
  },
  {
    path: 'driver/editDriver/:id', 
    component: DriverUpdateDriverComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'driver' }
  },
  {
    path: 'driver/viewBookings/:id', 
    component: DriverViewBookingsComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'driver' }
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'admin' }
  },
  {
    path: 'admin/createUser',
    component: AdminCreateUserComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'admin' }
  },
  {
    path: 'admin/viewUsers',
    component: AdminViewUsersComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'admin' }
  },
  {
    path: 'admin/editUser/:id',
    component: AdminUpdateUserComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'admin' }
  },
  {
    path: 'admin/createDriver',
    component: AdminCreateDriverComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'admin' }
  },
  {
    path: 'admin/viewDrivers',
    component: AdminViewDriversComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'admin' }
  },
  {
    path: 'admin/editDriver/:id',
    component: AdminUpdateDriverComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'admin' }
  },
  {
    path: 'admin/createBooking',
    component: AdminCreateBookingComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'admin' }
  },
  {
    path: 'admin/viewBookings',
    component: AdminViewBookingsComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'admin' }
  },
  {
    path: 'admin/editBooking/:bookingId',
    component: AdminUpdateBookingComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'admin' }
  },
  {
    path: 'superadmin',
    component: SuperadminDashboardComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'superadmin' }
  },
  {
    path: 'superadmin/viewEnquiries',
    component: SuperadminViewEnquiriesComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'superadmin' }
  },
  {
    path: 'superadmin/viewAdmins',
    component: SuperadminViewAdminsComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'superadmin' }
  },
  {
    path: 'superadmin/createAdmin',
    component: SuperadminCreateAdminComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'superadmin' }
  },
  {
    path: 'superadmin/editAdmin/:id',
    component: SuperadminUpdateAdminComponent,
    canActivate: [AuthGuard],
    data: { requiredRole: 'superadmin' }
  },
  {path: 'about-us', component: AboutUsComponent},
  {path: 'contact-us', component: ContactUsComponent},
  {path: 'hidden', component: HiddenComponent},
  {path: 'register', component: RegisterComponent},   
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  declarations: [
    AppComponent,
    MainFrameComponent,
    IndexComponent,
    HomeComponent,
    UserDashboardComponent,
    AboutUsComponent,
    ContactUsComponent,
    RegisterComponent,
    HiddenComponent,
    DriverDashboardComponent,
    SuperadminDashboardComponent,
    AdminDashboardComponent,
    SuperadminViewEnquiriesComponent,
    SuperadminCreateAdminComponent,
    SuperadminViewAdminsComponent,
    SuperadminUpdateAdminComponent,
    AdminCreateUserComponent,
    AdminCreateDriverComponent,
    AdminCreateBookingComponent,
    AdminViewUsersComponent,
    AdminViewDriversComponent,
    AdminViewBookingsComponent,
    AdminUpdateUserComponent,
    AdminUpdateDriverComponent,
    AdminUpdateBookingComponent,
    UserProfileComponent,
    DriverProfileComponent,
    UserCreateBookingComponent,
    UserViewBookingsComponent,
    DriverViewBookingsComponent,
    UserUpdateUserComponent,
    DriverUpdateDriverComponent,
    UserUpdateBookingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes) 
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
