import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

interface MascotMessage {
  text: string;
  cta: string;
  route?: string;
}

const SECTION_MESSAGES: Record<string, MascotMessage> = {
  top: { text: '¡Hola! ¿Vemos qué puedo hacer por tu mascota? 🐾', cta: 'Empezar por WhatsApp →' },
  servicios: { text: 'Elige un servicio y yo te acompaño hasta tu puerta', cta: 'Contáctanos por WhatsApp →' },
  especialistas: { text: 'Son todos buena gente, ¡te lo prometo!', cta: 'Contáctanos por WhatsApp →' },
  diagnostico: { text: 'Tranquilo... a mí tampoco me gustan las agujas 😅', cta: 'Contáctanos por WhatsApp →' },
  recordatorios: { text: 'Yo jamás olvido mis vacunas, palabra de perro', cta: 'Contáctanos por WhatsApp →' },
  tienda: { text: 'Oye... ¿me compras algo? 🦴', cta: 'Ver la tienda →', route: '/tienda' },
  testimonios: { text: '¡Todos me quieren mucho por aquí!', cta: 'Contáctanos por WhatsApp →' },
  faq: { text: '¿Dudas? Yo solo sé pedir premios, pero ellos sí saben 😄', cta: 'Contáctanos por WhatsApp →' },
  contacto: { text: '¿Hablamos? Prometo portarme bien', cta: 'Escríbenos por WhatsApp →' },
};

@Component({
  selector: 'app-dog-mascot',
  templateUrl: './dog-mascot.html',
  styleUrl: './dog-mascot.css',
})
export class DogMascotComponent implements AfterViewInit, OnDestroy {
  @ViewChild('video', { static: true }) private videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly router = inject(Router);
  private readonly sectionIds = Object.keys(SECTION_MESSAGES);
  private readonly cleanups: Array<() => void> = [];
  private frameId: number | null = null;
  private lastFrameTime = 0;
  private entering = true;
  private bubbleDismissed = false;

  readonly visible = signal(false);
  readonly currentSection = signal('top');
  readonly message = computed(() => SECTION_MESSAGES[this.currentSection()] ?? SECTION_MESSAGES['top']);
  readonly bubbleVisible = signal(false);
  readonly whatsappHref = `https://wa.me/51999999999?text=${encodeURIComponent('Hola, quiero agendar una consulta veterinaria a domicilio con Yego Pet 🐾')}`;

  ngAfterViewInit(): void {
    const video = this.videoRef.nativeElement;
    const resize = () => this.setCanvasSize();
    const scroll = () => this.handleScroll();

    this.setCanvasSize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', scroll, { passive: true });
    this.cleanups.push(
      () => window.removeEventListener('resize', resize),
      () => window.removeEventListener('scroll', scroll),
    );

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    void video.play().catch(() => undefined);
    this.handleScroll();
  }

  ngOnDestroy(): void {
    this.stopDrawing();
    this.cleanups.splice(0).forEach((cleanup) => cleanup());
  }

  onVideoEnded(): void {
    const video = this.videoRef.nativeElement;
    this.entering = false;
    video.currentTime = 0.03;
    void video.play().catch(() => undefined);
    this.updateBubbleVisibility();
  }

  onVideoTimeUpdate(): void {
    const video = this.videoRef.nativeElement;
    if (!this.entering && video.currentTime > 2.2) video.currentTime = 0.03;
  }

  dismissBubble(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.bubbleDismissed = true;
    this.updateBubbleVisibility();
  }

  handleBubbleClick(event: Event): void {
    const route = this.message().route;
    if (!route) return;
    event.preventDefault();
    void this.router.navigateByUrl(route);
  }

  private handleScroll(): void {
    const shouldShow = window.scrollY > 260;
    if (shouldShow !== this.visible()) {
      this.visible.set(shouldShow);
      shouldShow ? this.startDrawing() : this.stopDrawing();
      this.updateBubbleVisibility();
    }
    if (!shouldShow) return;

    let found = this.currentSection();
    for (const id of this.sectionIds) {
      const section = document.getElementById(id);
      if (!section) continue;
      const bounds = section.getBoundingClientRect();
      if (bounds.top <= 160 && bounds.bottom > 160) {
        found = id;
        break;
      }
    }
    if (found !== this.currentSection()) {
      this.currentSection.set(found);
      this.bubbleDismissed = false;
      this.updateBubbleVisibility();
    }
  }

  private updateBubbleVisibility(): void {
    this.bubbleVisible.set(this.visible() && !this.entering && !this.bubbleDismissed);
  }

  private setCanvasSize(): void {
    const canvas = this.canvasRef.nativeElement;
    const compact = window.innerWidth <= 360 || window.innerHeight <= 620;
    const mobile = window.innerWidth < 640;
    const width = compact ? 72 : mobile ? 84 : 104;
    const height = compact ? 128 : mobile ? 149 : 185;
    canvas.width = width * 2;
    canvas.height = height * 2;
  }

  private startDrawing(): void {
    if (this.frameId !== null) return;
    const draw = () => {
      this.frameId = requestAnimationFrame(draw);
      const now = performance.now();
      if (now - this.lastFrameTime < 32) return;
      this.lastFrameTime = now;
      const video = this.videoRef.nativeElement;
      const canvas = this.canvasRef.nativeElement;
      if (video.readyState < 2) return;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = frame.data;
      for (let index = 0; index < pixels.length; index += 4) {
        const red = pixels[index] - 155;
        const green = pixels[index + 1] - 153;
        const blue = pixels[index + 2] - 149;
        const distance = Math.sqrt(red * red + green * green + blue * blue);
        const alpha = distance <= 20 ? 0 : distance >= 62 ? 255 : ((distance - 20) / 42) * 255;
        pixels[index + 3] = Math.min(pixels[index + 3], alpha);
      }
      const startX = Math.floor(canvas.width * 0.84);
      const startY = Math.floor(canvas.height * 0.86);
      for (let y = startY; y < canvas.height; y++) {
        for (let x = startX; x < canvas.width; x++) pixels[(y * canvas.width + x) * 4 + 3] = 0;
      }
      context.putImageData(frame, 0, 0);
    };
    this.frameId = requestAnimationFrame(draw);
  }

  private stopDrawing(): void {
    if (this.frameId === null) return;
    cancelAnimationFrame(this.frameId);
    this.frameId = null;
  }
}
