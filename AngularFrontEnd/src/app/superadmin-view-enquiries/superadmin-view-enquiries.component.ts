import { Component, OnInit } from '@angular/core';
import { HiddenService } from '../controller-calls/hidden.service';
import { ContactResponse } from '../pojos/ContactResponse';
import { SearchService } from '../controller-calls/search.service';

@Component({
  selector: 'app-superadmin-view-enquiries',
  templateUrl: './superadmin-view-enquiries.component.html',
  styleUrls: ['./superadmin-view-enquiries.component.css']
})
export class SuperadminViewEnquiriesComponent implements OnInit {

  enquiries: ContactResponse[] = [];
  filteredEnquiries: ContactResponse[] = [];
  pageSize: number = 5;
  currentPage: number = 1;
  selectedFilterCriteria: string = 'name';
  searchTerm: string = '';

  constructor(private hiddenService: HiddenService, public searchService: SearchService) { }

  ngOnInit(): void {
    this.fetchEnquiries();
  }

  fetchEnquiries(): void {
    const adminKey = sessionStorage.getItem('adminKey');
    if (adminKey) {
      this.hiddenService.getAllContacts(adminKey).subscribe(
        (response: ContactResponse[]) => {
          this.enquiries = response;
          console.log('Fetched Enquiries:', this.enquiries);
          this.filterEnquiries();
        },
        (error) => {
          console.error("Error fetching enquiries:", error);
        }
      );
    } else {
      console.error("Admin key not found in sessionStorage");
    }
  }

  onPageChange(pageNumber: number, event: Event): void {
    event.preventDefault(); // Prevent the default behavior of the anchor tag
    this.currentPage = pageNumber;
    this.filterEnquiries();
  }  

  getPages(): number[] {
    const pageCount = Math.ceil(this.enquiries.length / this.pageSize);
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  filterEnquiries(): void {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
  
    // Apply filtering based on selected criteria
    if (this.selectedFilterCriteria === 'name') {
      this.filteredEnquiries = this.enquiries.filter(enquiry =>
        enquiry.contact.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    } else if (this.selectedFilterCriteria === 'email') {
      this.filteredEnquiries = this.enquiries.filter(enquiry =>
        enquiry.contact.email.toLowerCase().includes(lowerCaseSearchTerm)
      );
    } else if (this.selectedFilterCriteria === 'enquiries') {
      this.filteredEnquiries = this.enquiries.filter(enquiry =>
        enquiry.contact.enquiries.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
  
    // Update the array to show only the current page
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredEnquiries = this.filteredEnquiries.slice(startIndex, endIndex);
  }
}
