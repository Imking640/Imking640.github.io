// === Background Canvas Animation ===
const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles.length = 0;
    initParticles();
});

const starShapes = ["★", "✦", "✧", "✩", "✪", "✯", "✰", "🌟", "💫"];
const particles = [];
const particleCount = 50;

function getRandomColor() {
    const colors = ["#FFFAF0", "#F0F8FF", "#B0E0E6", "#E0FFFF", "#ADD8E6", "#87CEFA"];
    return colors[Math.floor(Math.random() * colors.length)];
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speedX = (Math.random() - 0.5) * 1.2;
        this.speedY = (Math.random() - 0.5) * 1.2;
        this.size = Math.random() * 22 + 14;
        this.symbol = starShapes[Math.floor(Math.random() * starShapes.length)];
        this.color = getRandomColor();
        this.opacity = Math.random() * 0.6 + 0.3;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.font = `${this.size}px Arial`;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fillText(this.symbol, this.x, this.y);
        ctx.globalAlpha = 1;
    }
}

function initParticles() {
    const rows = Math.sqrt(particleCount);
    const cols = Math.ceil(particleCount / rows);
    const rowSpacing = canvas.height / rows;
    const colSpacing = canvas.width / cols;

    for (let i = 0; i < particleCount; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = col * colSpacing + Math.random() * colSpacing * 0.5;
        const y = row * rowSpacing + Math.random() * rowSpacing * 0.5;
        particles.push(new Particle(x, y));
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// === Infinite Carousel Logic ===
const track = document.querySelector(".carousel-track");
const originalSlides = Array.from(document.querySelectorAll(".carousel-slide"));

// Clone all slides for seamless loop
originalSlides.forEach(slide => {
    const clone = slide.cloneNode(true);
    track.appendChild(clone);
});

let position = 0;
let slideWidth = originalSlides[0].offsetWidth + 30;

function autoScrollCarousel() {
    position += 1;
    if (position >= slideWidth * originalSlides.length) {
        position = 0;
        track.style.transition = "none"; // Instantly reset
    } else {
        track.style.transition = "transform 0.05s linear";
    }
    track.style.transform = `translateX(-${position}px)`;
    requestAnimationFrame(autoScrollCarousel);
}

window.addEventListener("load", () => {
    slideWidth = originalSlides[0].offsetWidth + 30;
    autoScrollCarousel();
});

// === Word-by-word Text Animation (About Section) ===
function retriggerAboutAnimation() {
    const paragraph = document.querySelector(".fun-paragraph");
    if (!paragraph) return;

    const text = paragraph.textContent.trim();
    const words = text.split(/(\s+)/);
    paragraph.innerHTML = "";

    words.forEach((chunk, index) => {
        const span = document.createElement("span");
        span.textContent = chunk;
        span.style.opacity = "0";
        span.style.display = "inline-block";
        span.style.transform = "translateY(20px)";
        span.style.transition = "all 0.3s ease";

        if (!chunk.trim()) {
            span.style.width = "4px";
        } else {
            span.style.marginRight = "3px";
        }

        paragraph.appendChild(span);

        setTimeout(() => {
            span.style.opacity = "1";
            span.style.transform = "translateY(0)";
        }, index * 30);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('.fade-in')?.classList.add('visible');
    retriggerAboutAnimation();
});

// === Fade-in on Scroll ===
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.2
});

document.querySelectorAll('.animate-section').forEach(section => {
    observer.observe(section);
});
document.addEventListener("DOMContentLoaded", () => {
    // Log the initial page view
    logEvent("view", document.body);
  
    // Listen for all clicks on the document
    document.addEventListener("click", (event) => {
      const target = event.target;
      logEvent("click", target);
    });
  
    // Function to log the event with format
    function logEvent(type, element) {
      const timestamp = new Date().toISOString();
      const elementType = getElementType(element);
  
      console.log(`${timestamp} , ${type} , ${elementType}`);
    }
  
    // Function to determine the type of HTML element or object
    function getElementType(el) {
      if (!el) return "unknown";
  
      const tag = el.tagName ? el.tagName.toLowerCase() : "";
  
      if (tag === "img") return "image";
      if (tag === "button") return "button";
      if (tag === "a") return "link";
      if (tag === "input") return el.type === "checkbox" || el.type === "radio" ? "form-option" : "text-field";
      if (tag === "select") return "drop-down";
      if (tag === "textarea") return "text-area";
      if (tag === "p" || tag === "span" || tag === "div") return "text";
      if (tag === "section" || tag === "article") return "container";
      if (tag === "canvas") return "canvas";
      if (el.classList.contains("icon") || el.className.toLowerCase().includes("icon")) return "icon";
  
      return tag || "unknown";
    }
});