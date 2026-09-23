import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  isScrolled = false;
  scrollProgress = 0;
  blurValue = 0;
  scaleValue = 1;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    // 1. Toggle header styling state when scrolled past 20px
    this.isScrolled = scrollPosition > 20;

    // 2. Calculate reading progress bar percentage
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    this.scrollProgress = docHeight > 0 ? (scrollPosition / docHeight) * 100 : 0;

    // 3. Calculate hero background dynamic blur & scale effects
    this.blurValue = Math.min(scrollPosition * 0.03, 12); // Caps blur at 12px
    this.scaleValue = 1 + scrollPosition * 0.0005;        // Subtle zoom effect on scroll
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