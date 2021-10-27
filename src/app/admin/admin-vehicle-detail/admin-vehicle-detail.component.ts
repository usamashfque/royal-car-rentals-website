import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Vehicle } from 'src/app/Models/vehicle.model';
import { VehicleService } from 'src/app/services/vehicle.service';


@Component({
  selector: 'app-admin-vehicle-detail',
  templateUrl: './admin-vehicle-detail.component.html',
  styleUrls: ['./admin-vehicle-detail.component.css']
})
export class AdminVehicleDetailComponent implements OnInit {
  @ViewChild('hideeditmodel') hideeditmodel: any;
  @ViewChild('showpicturemodel') showpicturemodel: any;
  @ViewChild('hidepicturemodel') hidepicturemodel: any;
  @ViewChild('hideuploadpicturemodel') hideuploadpicturemodel: any;
  @ViewChild('uploadImages') uploadImagesInput: ElementRef;
  vehicle: Vehicle;
  editVehicleObj: Vehicle;
  images: string[] = [];
  imagesCopy: string[] = [];
  files: string[] = [];
  deletePictureName: string;
  uploadImages: string;
  fileMessage = '';

  constructor(
    public vehicleService: VehicleService,
    private toastr: ToastrService,
    public activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.vehicle = JSON.parse(params["user"]);
      this.editVehicleObj = Object.assign({}, this.vehicle);
      console.log(JSON.parse(params["user"]));

      if (this.vehicle.imagesPath != "" && this.vehicle.imagesPath != null) {
        this.images = this.vehicle.imagesPath.split(',');
      }

    });

  }

  editVehicle() {
    console.log(this.editVehicleObj)

    this.vehicleService.editVehicle(this.editVehicleObj).subscribe(
      (response: any) => {
        this.vehicle = this.editVehicleObj;
        this.hideeditmodel.nativeElement.click();
        this.toastr.success('', 'Vehicle Updated Successfully');
      },
      error => {
        //form.form.reset();
        this.toastr.error('', 'Vehicle Updating Error');
        console.log("Error: " + error);
      }
    );
  }

  removePicture(name: string) {
    this.deletePictureName = name;
    this.showpicturemodel.nativeElement.click();
  }

  confirmDeletePicture() {
    console.log(this.deletePictureName)
    this.imagesCopy = this.images;
    let index = this.imagesCopy.findIndex(d => d === this.deletePictureName); //find index in your array
    this.imagesCopy.splice(index, 1);//remove element from array

    this.vehicle.imagesPath = this.imagesCopy.join();
    this.vehicleService.editVehicle(this.vehicle).subscribe(
      (response: any) => {
        this.images = this.imagesCopy;
        this.hidepicturemodel.nativeElement.click();
        this.toastr.success('', 'Deleted Successfully');
      },
      error => {
        this.vehicle.imagesPath = this.images.join();
        this.toastr.error('', 'Deleting Error');
        console.log("Error: " + error);
      }
    );

  }

  onFileChange(event: any) {
    this.files = [];
    var fileCount = event.target.files.length + this.images.length;

    if (fileCount <= 3) {
      this.fileMessage = '';
      for (var i = 0; i < event.target.files.length; i++) {
        this.files.push(event.target.files[i]);
      }
    } else {
      this.fileMessage = "You can select only " + (3 - this.images.length) + " file"
      this.uploadImagesInput.nativeElement.value = '';
    }
  }

  UploadPicture(form: NgForm) {

    const formData = new FormData();

    for (var i = 0; i < 3; i++) {
      formData.append("Files", this.files[i]);
    }

    formData.append("VehicleInfo", JSON.stringify(this.editVehicleObj));

    // this.vehicleService.addVehicle(formData).subscribe(
    //   (response: any) => {
    //     //set vehicle updated obj
    //     this.resetForm(form);
    //     this.hideuploadpicturemodel.nativeElement.click();
    //     this.toastr.success('', 'Vehicle Added Successfully');
    //   },
    //   error => {
    //     form.form.reset();
    //     this.toastr.error('', 'Vehicle Adding Error');
    //     console.log("Error: " + error);
    //   }
    // );
  }

  resetForm(form: NgForm) {
    form.form.reset();
    this.files = [];
  }

}