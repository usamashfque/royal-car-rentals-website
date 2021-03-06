import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Booking } from 'src/app/Models/booking.model';
import { Driver } from 'src/app/Models/driver.model';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-driver-bookings',
  templateUrl: './driver-bookings.component.html',
  styleUrls: ['./driver-bookings.component.css']
})
export class DriverBookingsComponent implements OnInit {
  BookingColumns: string[] = ['vehicleId', 'customerId', 'withDriver', 'status', 'startTime', 'endTime', 'dateAdded', 'dateUpdated', 'actions'];
  bookings: MatTableDataSource<Booking>;
  @ViewChild('BookingTable', { static: true }) bookingTable: MatTable<Booking>;
  @ViewChild('BookingPaginator', { static: true }) bookingPaginator: MatPaginator;
  @ViewChild('BookingSort', { static: true }) bookingSort: MatSort;
  public driver: Driver;

  constructor(
    public bookingService: BookingService,
    private toastr: ToastrService,
    private router: Router
  ) { 
    this.driver = JSON.parse(localStorage.getItem('signindriverinfo') || 'null');
  }

  ngOnInit(): void {
    this.getBookings();
  }

  getBookings() {
    this.bookingService.getDriverBookings(this.driver.id).subscribe(
      (response: any) => {
        this.bookings = new MatTableDataSource(response);
        this.bookings.paginator = this.bookingPaginator;
        this.bookings.sort = this.bookingSort;
      },
      (error: any) => {
        console.log("Error: ", error);
      }
    );
  }

  viewBooking(data: any) {
    let _data = JSON.stringify(data);
    this.router.navigate(["driver/booking-detail"], { queryParams: { _data } });
  }

}
