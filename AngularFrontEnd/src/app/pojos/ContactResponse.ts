import { Contact } from "./Contact";

export class ContactResponse {
    contact?: Contact;
    message?: string;

    constructor(contact: Contact, message: string) {
        this.contact = contact;
        this.message = message;
      }
}