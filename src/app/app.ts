import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-angular-app');

  // Scroll blur properties for the hero background
  blurValue = 0;
  scaleValue = 1.05;

  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollPosition = window.scrollY;
    this.blurValue = Math.min(scrollPosition / 30, 12);
    this.scaleValue = 1.05 + Math.min(scrollPosition / 2000, 0.05);
  }

  // Web3Forms Contact Submission Handler
  async onSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    
    if (!submitBtn) return;

    const formData = new FormData(form);
    formData.append("access_key", "0d3f742c-6a30-4a26-a628-ec268f888cf3");

    const originalText = submitBtn.textContent || "Send Message";
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (response.ok) {
        alert("Success! Your message has been sent.");
        form.reset();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }
}