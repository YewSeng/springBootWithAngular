import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit{
  scrollingText: string = 'Life is an event. Make it memorable.';
  youtubeVideoSrc: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Use DomSanitizer to mark the YouTube video URL as safe
    this.youtubeVideoSrc = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/I0z_msathVg');     
  }
}
