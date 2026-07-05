export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  specs: string[];
}

export const PRODUCT_CATEGORIES = ['Todos', 'Alimento', 'Higiene', 'Premios', 'Accesorios', 'Descanso', 'Salud', 'Juego'] as const;

export const PRODUCTS: Product[] = [
  { id: 'alimento-perro', name: 'Alimento premium para perros', category: 'Alimento', price: 89.9, description: 'Fórmula balanceada para todas las razas y edades.', specs: ['Presentación: bolsa de 15 kg', 'Edad: todas las edades', 'Raciones según peso corporal; revisa la tabla del empaque'] },
  { id: 'alimento-gato', name: 'Alimento premium para gatos', category: 'Alimento', price: 84.9, description: 'Nutrición completa con proteína real de pescado.', specs: ['Presentación: bolsa de 7.5 kg', 'Edad: adultos', 'Combinar con agua fresca disponible todo el día'] },
  { id: 'shampoo', name: 'Shampoo antipulgas', category: 'Higiene', price: 29.9, description: 'Limpieza suave con protección antiparasitaria.', specs: ['Contenido: 500 ml', 'Uso: cada 15–20 días', 'Enjuagar bien y evitar contacto con los ojos'] },
  { id: 'snacks', name: 'Snacks naturales', category: 'Premios', price: 19.9, description: 'Premios saludables para entrenamiento y cariño.', specs: ['Contenido: 200 g', 'Ingredientes: 100% naturales', 'No exceder el 10% de la dieta diaria'] },
  { id: 'collar', name: 'Collar antipulgas', category: 'Accesorios', price: 34.9, description: 'Protección prolongada, cómoda y ajustable.', specs: ['Tallas: S, M, L', 'Duración: hasta 8 meses', 'Ajustar dejando espacio para 2 dedos'] },
  { id: 'arenero', name: 'Arenero para gatos', category: 'Accesorios', price: 59.9, description: 'Diseño cerrado que ayuda a controlar olores.', specs: ['Medidas: 55 × 40 × 40 cm', 'Incluye filtro de carbón activado', 'Cambiar la arena cada 2–3 semanas'] },
  { id: 'cama', name: 'Cama ortopédica', category: 'Descanso', price: 119.9, description: 'Espuma viscoelástica para un descanso reparador.', specs: ['Medidas: 70 × 50 cm (talla M)', 'Funda lavable', 'Ideal para articulaciones sensibles'] },
  { id: 'vitaminas', name: 'Vitaminas y suplementos', category: 'Salud', price: 42.9, description: 'Refuerzo nutricional para piel, pelaje y articulaciones.', specs: ['Contenido: 60 tabletas', 'Dosis: 1 tableta por cada 10 kg', 'Dar junto con la comida'] },
  { id: 'juguete', name: 'Juguete interactivo', category: 'Juego', price: 24.9, description: 'Estimulación mental para reducir el aburrimiento.', specs: ['Material: caucho no tóxico', 'Medidas: 12 cm', 'Supervisar las primeras sesiones'] },
];
