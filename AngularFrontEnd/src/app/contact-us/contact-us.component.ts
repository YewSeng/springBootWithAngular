import { Component, OnInit } from '@angular/core';
import { IndexService } from '../controller-calls/index.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactResponse } from '../pojos/ContactResponse';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  scrollingText: string = 'Have any burning questions unanswered? Contact us now!';
  contactForm: FormGroup;
  submitted: boolean = false;
  successMessage: string;
  errorMessage: string;

  constructor(private indexService: IndexService, private formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.initializeForm();    
  }

  initializeForm(): void {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.minLength(10), Validators.email]],
      enquiries: ['', [Validators.required, Validators.minLength(10)]],
    }) as FormGroup;;
  }

  addResponse(): void {
    if (this.contactForm.valid) {
      const contactData = this.contactForm.value;

      this.indexService.createEnquiry(contactData).subscribe(
        (response: ContactResponse) => {
          this.submitted = true;
          this.successMessage = 'Enquiry submitted successfully!';
          this.errorMessage = null;
        },
        (error) => {
          this.submitted = false;
          this.errorMessage = 'Error submitting enquiry. Please try again.';
          this.successMessage = null;
        }
      );
    } else {
      this.submitted = false;
      this.errorMessage = 'Please fix the errors in the form.';
      this.successMessage = null;
    }
  }

  get formControls() {
    return this.contactForm.controls;
  }

}
