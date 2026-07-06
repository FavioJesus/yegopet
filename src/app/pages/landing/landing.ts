import { AfterViewInit, Component, ElementRef, OnDestroy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DogMascotComponent } from '../../components/dog-mascot/dog-mascot';

interface Specialist {
  id: string;
  name: string;
  role: string;
  years: string;
  credential: string;
  bio: string;
}

@Component({
  selector: 'app-landing',
  imports: [RouterLink, DogMascotComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly cleanups: Array<() => void> = [];
  private readonly specialists: Specialist[] = [
    { id: 'general', name: 'Dra. Camila Rojas', role: 'Medicina general', years: '8', credential: 'MV · Univ. Nacional Mayor de San Marcos', bio: 'Lidera las consultas generales y el seguimiento preventivo de cada mascota, con enfoque en medicina a domicilio.' },
    { id: 'trauma', name: 'Dr. Andrés Paredes', role: 'Traumatología', years: '10', credential: 'MV · Especialista en ortopedia veterinaria', bio: 'Diagnostica y trata fracturas, luxaciones y lesiones articulares, con planes de recuperación adaptados a casa.' },
    { id: 'nutri', name: 'Dra. Valentina Solís', role: 'Nutrición y acupuntura', years: '7', credential: 'MV · Certificación en acupuntura veterinaria', bio: 'Diseña planes nutricionales y sesiones de acupuntura para el bienestar integral de tu mascota.' },
    { id: 'cardio', name: 'Dr. Mateo Rivas', role: 'Cardiología', years: '12', credential: 'MV · Especialista en cardiología veterinaria', bio: 'Evalúa la salud cardiovascular con equipos portátiles, clave para mascotas senior o de razas de riesgo.' },
    { id: 'cirugia', name: 'Dra. Renata Luque', role: 'Cirugías', years: '9', credential: 'MV · Cirugía general y de tejidos blandos', bio: 'Coordina evaluaciones pre-quirúrgicas y acompaña la recuperación post-operatoria en casa.' },
    { id: 'rx', name: 'Dr. Joaquín Vega', role: 'Rayos X', years: '6', credential: 'MV · Diagnóstico por imagen', bio: 'Realiza e interpreta radiografías móviles para huesos, tórax y abdomen sin salir de casa.' },
    { id: 'eco', name: 'Dra. Isabela Franco', role: 'Ecografía', years: '8', credential: 'MV · Especialista en ecografía veterinaria', bio: 'Evalúa órganos internos y gestaciones con ecografía portátil de alta precisión.' },
  ];

  ngAfterViewInit(): void {
    const root: HTMLElement = this.host.nativeElement;
    const on = (target: EventTarget, event: string, listener: EventListener) => {
      target.addEventListener(event, listener);
      this.cleanups.push(() => target.removeEventListener(event, listener));
    };

    const menu = root.querySelector<HTMLElement>('[data-nav-mobile-menu]');
    const burger = root.querySelector<HTMLElement>('[data-nav-burger]');
    if (menu && burger) {
      const closeMenu = () => {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      };
      on(burger, 'click', () => {
        const open = menu.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(open));
      });
      menu.querySelectorAll('a').forEach((link) => on(link, 'click', closeMenu));
      on(document, 'keydown', (event) => {
        if ((event as KeyboardEvent).key === 'Escape') closeMenu();
      });
    }

    const nav = root.querySelector<HTMLElement>('[data-nav]');
    const backToTop = root.querySelector<HTMLElement>('[data-back-to-top]');
    const handleScroll = () => {
      nav?.classList.toggle('nav--condensed', window.scrollY > 40);
      backToTop?.classList.toggle('is-visible', window.scrollY > 500);
    };
    on(window, 'scroll', handleScroll);
    handleScroll();
    if (backToTop) on(backToTop, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const reveals = root.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach((element) => observer.observe(element));
    this.cleanups.push(() => observer.disconnect());

    root.querySelectorAll<HTMLElement>('.faq-item').forEach((item) => {
      const question = item.querySelector<HTMLElement>('.faq-item__q');
      const icon = item.querySelector<HTMLElement>('.faq-item__icon');
      if (question) on(question, 'click', () => {
        const open = item.classList.toggle('is-open');
        question.setAttribute('aria-expanded', String(open));
        if (icon) icon.textContent = open ? '–' : '+';
      });
    });

    this.setupSpecialistModal(root, on);
    this.setupCarousel(root, on, '[data-specialists-track]', '[data-specialists-prev]', '[data-specialists-next]', 260, 3200);
    this.setupCarousel(root, on, '[data-products-track]', '[data-products-prev]', '[data-products-next]', 242, 3600);

    const whatsappLink = `https://wa.me/51999999999?text=${encodeURIComponent('Hola Yego Pet, quisiera agendar una consulta para mi mascota.')}`;
    root.querySelectorAll<HTMLAnchorElement>('[data-whatsapp-href]').forEach((link) => {
      link.href = whatsappLink;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
  }

  ngOnDestroy(): void {
    this.cleanups.splice(0).forEach((cleanup) => cleanup());
  }

  private setupSpecialistModal(root: HTMLElement, on: (target: EventTarget, event: string, listener: EventListener) => void): void {
    const overlay = root.querySelector<HTMLElement>('[data-spec-modal]');
    if (!overlay) return;
    const setText = (selector: string, value: string) => {
      const element = overlay.querySelector<HTMLElement>(selector);
      if (element) element.textContent = value;
    };
    const close = () => overlay.classList.remove('is-open');
    root.querySelectorAll<HTMLElement>('[data-specialist-id]').forEach((card) => on(card, 'click', () => {
      const specialist = this.specialists.find((item) => item.id === card.dataset['specialistId']);
      if (!specialist) return;
      setText('[data-spec-name]', specialist.name);
      setText('[data-spec-role]', specialist.role);
      setText('[data-spec-years]', specialist.years);
      setText('[data-spec-credential]', specialist.credential);
      setText('[data-spec-bio]', specialist.bio);
      overlay.classList.add('is-open');
    }));
    const closeButton = overlay.querySelector<HTMLElement>('[data-spec-modal-close]');
    if (closeButton) on(closeButton, 'click', close);
    on(overlay, 'click', (event) => { if (event.target === overlay) close(); });
    on(document, 'keydown', (event) => { if ((event as KeyboardEvent).key === 'Escape') close(); });
  }

  private setupCarousel(root: HTMLElement, on: (target: EventTarget, event: string, listener: EventListener) => void, trackSelector: string, prevSelector: string, nextSelector: string, step: number, intervalMs: number): void {
    const track = root.querySelector<HTMLElement>(trackSelector);
    if (!track) return;
    let paused = false;
    const prev = root.querySelector<HTMLElement>(prevSelector);
    const next = root.querySelector<HTMLElement>(nextSelector);
    if (prev) on(prev, 'click', () => track.scrollBy({ left: -step, behavior: 'smooth' }));
    if (next) on(next, 'click', () => track.scrollBy({ left: step, behavior: 'smooth' }));
    on(track, 'mouseenter', () => { paused = true; });
    on(track, 'mouseleave', () => { paused = false; });
    const timer = window.setInterval(() => {
      if (paused) return;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      atEnd ? track.scrollTo({ left: 0, behavior: 'smooth' }) : track.scrollBy({ left: step, behavior: 'smooth' });
    }, intervalMs);
    this.cleanups.push(() => window.clearInterval(timer));
  }
}
