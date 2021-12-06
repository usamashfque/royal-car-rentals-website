import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Booking } from 'src/app/Models/booking.model';
import { Driver } from 'src/app/Models/driver.model';
import { Payment } from 'src/app/Models/payment.model';
import { BookingService } from 'src/app/services/booking.service';
import { CustomerService } from 'src/app/services/customer.service';
import { DriverService } from 'src/app/services/driver.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-admin-booking-detail',
  templateUrl: './admin-booking-detail.component.html',
  styleUrls: ['./admin-booking-detail.component.css']
})
export class AdminBookingDetailComponent implements OnInit {
  @ViewChild('bookingstatus') bookingstatus: MatSelect;
  @ViewChild('hideeditmodel') hideeditmodel: any;
  @ViewChild('paidamount') paidamount: any;
  @ViewChild('hideeditpaymentmodel') hideeditpaymentmodel: any;
  public booking: Booking;
  public editBookingObj: Booking;
  public paymentObj: Payment;
  public editPaymentObj: Payment;
  public drivers: Driver[] = [];
  public isLoading: boolean = false;

  public editBookingForm = new FormGroup({
    status: new FormControl('', [Validators.required]),
    driverId: new FormControl('')
  });

  public editPaymentForm = new FormGroup({
    totalAmount: new FormControl('', [Validators.required]),
    paidAmount: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{1,10}$")]),
    discountAmount: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{1,10}$")]),
  });

  public totaldays: number = 0;
  public totalPrice: number = 0;

  constructor(
    public customerService: CustomerService,
    public bookingService: BookingService,
    public activatedRoute: ActivatedRoute,
    public driverService: DriverService,
    public paymentService: PaymentService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.booking = JSON.parse(this.activatedRoute.snapshot.queryParams._data);
    console.log(this.booking)
  }

  ngOnInit(): void {
    this.getDrivers(this.booking.cityId);
    this.getPaymentByBookingId(this.booking.id)

    if (this.booking) {
      // To calculate the time difference of two dates
      var Difference_In_Time = new Date(this.booking.endDate).getTime() - new Date(this.booking.startDate).getTime();

      // To calculate the no. of days between two dates
      this.totaldays = Difference_In_Time / (1000 * 3600 * 24);

      if (this.totaldays == 0) {
        this.totaldays = 1;
      }

      this.totalPrice = this.totaldays * this.booking.vehicle.price;
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.editBookingForm.controls[controlName].hasError(errorName);
  }

  public hasErrorPayment = (controlName: string, errorName: string) => {
    return this.editPaymentForm.controls[controlName].hasError(errorName);
  }

  showEditModel() {
    this.editBookingObj = Object.assign({}, this.booking);

    this.editBookingForm.setValue({
      status: this.editBookingObj.status,
      driverId: this.editBookingObj.driverId,
    });

    // // this.showeditmodel.nativeElement.click();
    setTimeout(() => {
      if (this.bookingstatus) this.bookingstatus.focus();
    }, 600);
  }

  changeStatus(formValue: any, formDirective: FormGroupDirective) {
    this.isLoading = true;
    this.editBookingObj.status = formValue.status;
    if (this.booking.withDriver) {
      if (formValue.driverId) {
        this.editBookingObj.driverId = formValue.driverId;
      }
      else {
        this.isLoading = false;
        this.toastr.error('Select driver for this booking', 'Assign Driver');
        return;
      }
    }

    console.log(this.editBookingObj);
    this.bookingService.edit(this.editBookingObj).subscribe(
      (response: any) => {
        this.booking = Object.assign({}, this.editBookingObj);
        this.resetForm(formDirective);
        this.hideeditmodel.nativeElement.click();
        this.toastr.success('', 'Booking Status Updated Successfully');
      },
      error => {
        this.isLoading = false;
        this.toastr.error('', 'Status Updating Error');
        console.log("Error: ", error);
      }
    );
  }

  resetForm(formDirective: FormGroupDirective) {
    this.isLoading = false;
    formDirective.resetForm();
    this.editBookingObj = new Booking();
  }

  getDrivers(cityId: number) {
    this.driverService.searchByCityId(cityId).subscribe(
      (response: any) => {
        this.drivers = response;
        console.log(this.drivers)
      },
      (error: any) => {
        console.log("Error: ", error);
      }
    );
  }

  showEditPaymentModel() {
    this.editPaymentObj = Object.assign({}, this.paymentObj);

    this.editPaymentForm.setValue({
      totalAmount: this.editPaymentObj.totalAmount,
      paidAmount: this.editPaymentObj.paidAmount,
      discountAmount: this.editPaymentObj.discountAmount,
    });

    setTimeout(() => {
      this.paidamount.nativeElement.focus();
    }, 600);
  }

  updatePayment(formValue: any, formDirective: FormGroupDirective) {
    this.isLoading = true;
    this.editPaymentObj.totalAmount = formValue.totalAmount;
    this.editPaymentObj.paidAmount = formValue.paidAmount;
    this.editPaymentObj.discountAmount = formValue.discountAmount;


    console.log(this.editPaymentObj);

    this.paymentService.edit(this.editPaymentObj).subscribe(
      (response: any) => {
        this.paymentObj = Object.assign({}, this.editPaymentObj);        
        this.resetPaymentForm(formDirective);
        this.hideeditpaymentmodel.nativeElement.click();
        this.toastr.success('', 'Payment Updated Successfully');
      },
      error => {
        this.isLoading = false;
        this.toastr.error('', 'Payment Updating Error');
        console.log("Error: ", error);
      }
    );
  }

  resetPaymentForm(formDirective: FormGroupDirective) {
    this.isLoading = false;
    formDirective.resetForm();
    this.editPaymentObj = new Payment();
  }

  getPaymentByBookingId(bookingId: number) {
    this.paymentService.getByBookingId(bookingId).subscribe(
      (response: any) => {
        this.paymentObj = response;
        console.log(this.paymentObj)
      },
      (error: any) => {
        console.log("Error: ", error);
      }
    );
  }
}
