import { Component, OnInit, ViewChild } from '@angular/core';
import { Vehicle } from 'src/app/Models/vehicle.model';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { VehicleService } from 'src/app/services/vehicle.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'app-admin-vehicle',
  templateUrl: './admin-vehicle.component.html',
  styleUrls: ['./admin-vehicle.component.css']
})
export class AdminVehicleComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  newVehicle: Vehicle = {
    id: 0,
    makerName: '',
    modelName: '',
    modelYear: 0,
    registrationNumber: '',
    color: '',
    status: 'pending',
    availability: false,
    price: 0,
    imagesPath: '',
    dateAdded: new Date().toISOString(),
    dateUpdated: new Date().toISOString()
  };
  files: string[] = [];
  title = 'datatables';
  dtOptions: DataTables.Settings = {
    //default number of records per page
    pageLength: 10,
    //It can be simple or full_numbers
    pagingType: 'full_numbers',
    autoWidth: false,
    responsive: true,
    //select from drop down list to select number of records per page 
    lengthMenu: [10, 20, 30, 40],
    processing: true,
    columns: [
      { data: 'id', orderable: true },
      { data: 'makerName', orderable: false },
      { data: 'registrationNumber', orderable: false },
      { data: 'status', orderable: false },
      { data: 'availability', orderable: false },
      { data: 'price', orderable: true },
      { data: 'dateAdded', orderable: true },
      { data: 'action', orderable: false },
    ]
  };

  //{ data: 'modelYear' }, { data: 'Email' }, { data: 'IsActive' }, { defaultContent: '', orderable: false }
  @ViewChild(DataTableDirective)


  dtElement: DataTableDirective;




  dtTrigger: Subject<any> = new Subject();
  public vehicles: Vehicle[];

  constructor(
    public vehicleService: VehicleService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getVehicles();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  getVehicles() {
    this.vehicleService.getVehicles().subscribe(
      (response: any) => {
        this.vehicles = response
        this.rerender();
        console.log("Success: " + response);
      },
      (error: any) => {
        console.log("Error: " + error);
      }
    );
  }

  onFileChange(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.files.push(event.target.files[i]);
    }
  }

  addVehicle(form: NgForm) {
    console.log(this.newVehicle)

    const formData = new FormData();

    for (var i = 0; i < this.files.length; i++) {
      formData.append("Files", this.files[i]);
    }

    formData.append("VehicleInfo", JSON.stringify(this.newVehicle));

    this.vehicleService.addVehicle(formData).subscribe(
      (response: any) => {
        this.vehicles.push(response)
        this.rerender();
        this.resetForm(form);
        this.closebutton.nativeElement.click();
        this.toastr.success('', 'Administration Login Successfully');
      },
      error => {
        form.form.reset();
        this.toastr.error('', 'Incorrect Email and Password!');
        console.log("Error: " + error);
      }
    );
  }

  resetForm(form: NgForm) {
    form.form.reset();
    this.newVehicle = new Vehicle();
    this.files = [];
  }

  viewVehicle() {
    console.log("viewVehicle")
  }

  editVehicle() {
    console.log("editVehicle")
  }

  deleteVehicle() {
    console.log("deleteVehicle")
  }

}