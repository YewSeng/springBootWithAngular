export class Contact {
    contactId?: string;
    name?: string;
    email?: string;
    enquiries?: string;

    constructor(name: string, email: string, enquiries: string) {
        this.name = name;
        this.email = email;
        this.enquiries = enquiries;
    }
}
