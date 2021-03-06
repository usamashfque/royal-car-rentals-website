import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/Models/customer.model';
import { VehicleMaker } from 'src/app/Models/vehicle-maker.model';
import { VehicleModel } from 'src/app/Models/vehicle-model.model';
import { CustomerService } from 'src/app/services/customer.service';
import { VehicleMakerService } from 'src/app/services/vehicle-maker.service';
import { VehicleModelService } from 'src/app/services/vehicle-model.service';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-common-section',
  templateUrl: './common-section.component.html',
  styleUrls: ['./common-section.component.css']
})
export class CommonSectionComponent implements OnInit {
  public vehicleMakers: VehicleMaker[];
  public vehicleModels: VehicleModel[];
  isAuthenticated: boolean = false;
  registerCustomer: Customer;

  constructor(
    public vehicleModelService: VehicleModelService,
    public vehicleMakerService: VehicleMakerService,
    public customerService: CustomerService,
    public vehicleService: VehicleService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    toastr: ToastrService
  ) {
    this.registerCustomer = JSON.parse(localStorage.getItem('signincustomerinfo') || 'null');
    console.log(this.registerCustomer)
    if (this.registerCustomer) {
      this.getCustomer();
    }
  }

  ngOnInit(): void {
    this.getVehicleMakers();
    this.getVehicleModels();

    if (this.registerCustomer) {
      this.customerService.isAuthenticatedCustomer.emit(true);
      this.isAuthenticated = true;
    } else if (this.router.url == "/public/bookings" || this.router.url == "/public/profile") {
      localStorage.removeItem("signincustomerinfo");
      this.customerService.isAuthenticatedCustomer.emit(false);
      this.router.navigateByUrl("public/register");
    } else {
      localStorage.removeItem("signincustomerinfo");
      this.customerService.isAuthenticatedCustomer.emit(false);
    }


    this.router.events.subscribe(e => {
      this.registerCustomer = JSON.parse(localStorage.getItem('signincustomerinfo') || 'null');
      if (e instanceof NavigationEnd) {
        if (this.registerCustomer) {
          this.customerService.isAuthenticatedCustomer.emit(true);
          this.isAuthenticated = true;
        } else if (this.router.url == "/public/bookings" || e.url == "/public/profile") {
          localStorage.removeItem("signincustomerinfo");
          this.customerService.isAuthenticatedCustomer.emit(false);
          this.router.navigateByUrl("public/register");
        } else {
          localStorage.removeItem("signincustomerinfo");
          this.customerService.isAuthenticatedCustomer.emit(false);
        }
      }
    });

    this.customerService.isAuthenticatedCustomer.subscribe(response => {
      this.isAuthenticated = response;
    });
  }

  ngAfterViewInit(): void {
    // console.log("ngAfterViewInit")
  }

  getVehicleMakers() {
    this.vehicleMakerService.gets().subscribe(
      (response: any) => {
        this.vehicleMakers = response;
      },
      (error: any) => {
        console.log("Error: ", error);
      }
    );
  }

  getVehicleModels() {
    this.vehicleModelService.gets().subscribe(
      (response: any) => {
        this.vehicleModels = response;
      },
      (error: any) => {
        console.log("Error: ", error);
      }
    );
  }

  signOut() {
    localStorage.removeItem("signincustomerinfo");
    this.customerService.isAuthenticatedCustomer.emit(false);
    this.router.navigateByUrl("public/register");
  }

  getCustomer() {
    this.customerService.get(this.registerCustomer).subscribe(
      (response: any) => {
        this.registerCustomer = Object.assign({}, response);
        localStorage.setItem('signincustomerinfo', JSON.stringify(response));
      },
      (error: any) => {
        this.signOut();
        console.log("Error: ", error);
      }
    );
  }

}
