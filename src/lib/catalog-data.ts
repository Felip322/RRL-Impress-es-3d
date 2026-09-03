export type CatalogProduct = {
  id: string
  code: string
  name: string
  description: string
  category: string
  price: number | null
  status: string
  stock: number | null
  image_url: string
  active: boolean
  featured: boolean
  created_at?: string
}

export const FALLBACK_PRODUCTS: CatalogProduct[] = [
  { id: 'local-1', code: 'RRL-001', image_url: '/projeto-instagram-01.jpg', name: 'Peça temática multicolorida', category: 'Personalizados', price: null, description: 'Peça decorativa com combinação de cores e detalhes marcantes. Tamanho e acabamento podem ser personalizados.', status: 'Disponível sob encomenda', stock: null, active: true, featured: true },
  { id: 'local-2', code: 'RRL-002', image_url: '/projeto-instagram-02.jpg', name: 'Criatura articulada', category: 'Articulados', price: null, description: 'Modelo articulado produzido em filamento de efeito brilhante, ideal para presentear, colecionar ou decorar.', status: 'Disponível sob encomenda', stock: null, active: true, featured: false },
  { id: 'local-3', code: 'RRL-003', image_url: '/projeto-instagram-04.jpg', name: 'Escultura de efeito cinético', category: 'Decoração', price: null, description: 'Forma geométrica com efeito visual multicolorido que muda conforme o ângulo de observação.', status: 'Disponível sob encomenda', stock: null, active: true, featured: false },
  { id: 'local-4', code: 'RRL-004', image_url: '/conceito-personalizados.png', name: 'Presente personalizado', category: 'Personalizados', price: null, description: 'Uma criação feita para marcar momentos especiais, com opções de cor, tamanho e detalhes exclusivos.', status: 'Produção personalizada', stock: null, active: true, featured: false },
]

export const formatPrice = (price: number | null) => price === null
  ? 'Sob consulta'
  : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)
