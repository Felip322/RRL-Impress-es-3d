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

export const formatPrice = (price: number | null) => price === null
  ? 'Sob consulta'
  : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)
