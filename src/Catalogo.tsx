import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Menu, MessageCircle, PackageCheck, Search, Sparkles, X } from 'lucide-react'
import { FALLBACK_PRODUCTS, formatPrice, type CatalogProduct } from './lib/catalog-data'
import { isSupabaseConfigured, supabase } from './lib/supabase'

const INSTAGRAM = 'https://www.instagram.com/rrlimpressoes3d'

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" stroke="none"/></svg>
}

function BrandLogo() {
  return <a className="logo" href="./index.html#inicio" aria-label="RRL Impressões 3D - página inicial"><img className="brand-logo" src="/logo-oficial.png" alt="RRL Impressões 3D" /></a>
}

export default function Catalogo() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [category, setCategory] = useState('Todos')
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<CatalogProduct[]>(FALLBACK_PRODUCTS)
  const [loadingProducts, setLoadingProducts] = useState(isSupabaseConfigured)

  const categories = ['Todos', ...Array.from(new Set(products.map(item => item.category)))]
  const filteredItems = useMemo(() => products.filter(item =>
    (category === 'Todos' || item.category === category) &&
    `${item.code} ${item.name} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase())
  ), [category, products, query])

  useEffect(() => {
    if (!supabase) return
    const client = supabase
    const loadProducts = async () => {
      const { data, error } = await client.from('products').select('*').eq('active', true).order('featured', { ascending: false }).order('created_at', { ascending: false })
      if (!error && data) setProducts(data as CatalogProduct[])
      setLoadingProducts(false)
    }
    void loadProducts()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    const onEscape = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    const onResize = () => window.innerWidth > 900 && setMenuOpen(false)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onEscape)
    window.addEventListener('resize', onResize)
    document.body.classList.toggle('menu-open', menuOpen)
    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onEscape)
      window.removeEventListener('resize', onResize)
    }
  }, [menuOpen])

  return <div className="site-shell catalog-page">
    <header className={scrolled ? 'header scrolled' : 'header'}>
      <div className="nav-container">
        <BrandLogo />
        <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Navegação principal">
          <a href="./index.html#inicio">Início</a>
          <a href="./index.html#solucoes">Soluções</a>
          <a href="./index.html#projetos">Projetos</a>
          <a href="./index.html#processo">Processo</a>
          <a href="./index.html#sobre">Sobre</a>
          <a className="nav-current" href="#catalogo">Catálogo</a>
        </nav>
        <a className="header-cta" href={INSTAGRAM} target="_blank" rel="noreferrer">Pedir orçamento <ArrowRight /></a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>

    <main>
      <section className="catalog-hero">
        <div className="catalog-hero-grid" aria-hidden="true" />
        <div className="catalog-orbit orbit-one" aria-hidden="true" /><div className="catalog-orbit orbit-two" aria-hidden="true" />
        <div className="container catalog-hero-content">
          <div>
            <a className="catalog-back" href="./index.html"><ArrowLeft /> Voltar ao site</a>
            <div className="eyebrow"><span /> Catálogo RRL</div>
            <h1>Peças que já<br /><em>ganharam forma.</em></h1>
            <p>Explore modelos disponíveis e encontre a próxima peça para sua coleção, decoração ou presente.</p>
            <div className="catalog-trust"><span><PackageCheck /> Produção sob encomenda</span><span><Check /> Personalização disponível</span></div>
          </div>
          <div className="catalog-hero-art" aria-hidden="true"><span className="catalog-spark spark-one" /><span className="catalog-spark spark-two" /><img src="/conceito-cinetico.png" alt="" fetchPriority="high" /></div>
        </div>
      </section>

      <section className="catalog-listing container" id="catalogo">
        <div className="catalog-heading">
          <div><div className="section-tag">PEÇAS À VENDA</div><h2>Escolha uma criação.<br /><em>Deixe do seu jeito.</em></h2></div>
          <p>As cores e dimensões podem variar conforme o modelo. Fale com a gente para confirmar valor, prazo e opções de personalização.</p>
        </div>

        <div className="catalog-toolbar">
          <div className="catalog-filters" role="group" aria-label="Filtrar por categoria">{categories.map(item => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <label className="catalog-search"><Search /><span className="sr-only">Buscar no catálogo</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar peça ou código" /></label>
        </div>

        <div className="catalog-count"><b>{String(filteredItems.length).padStart(2, '0')}</b> {loadingProducts ? 'carregando catálogo' : filteredItems.length === 1 ? 'peça encontrada' : 'peças encontradas'}</div>
        <div className="catalog-grid">
          {filteredItems.map(item => <article className="catalog-card" key={item.id}>
            <div className="catalog-card-image"><img src={item.image_url} alt={item.name} loading="lazy" decoding="async" /><span className={item.stock === 0 ? 'sold-out' : ''}><i /> {item.stock === 0 ? 'Esgotado' : item.status}</span><b>{item.category}</b></div>
            <div className="catalog-card-body"><div><span className="catalog-code">CÓDIGO <b>{item.code}</b></span><h3>{item.name}</h3><p>{item.description}</p></div><div className="catalog-price"><span>VALOR</span><strong>{formatPrice(item.price)}</strong>{item.stock !== null && <small>{item.stock} {item.stock === 1 ? 'unidade disponível' : 'unidades disponíveis'}</small>}</div><a href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label={`Tenho interesse no produto ${item.code}`}>Tenho interesse <span>{item.code}</span><ArrowRight /></a></div>
          </article>)}
        </div>
        {filteredItems.length === 0 && <div className="catalog-empty"><Sparkles /><h3>Nenhuma peça encontrada.</h3><p>Tente outra categoria ou termo de busca.</p></div>}
      </section>

      <section className="catalog-custom container"><div className="catalog-custom-icon"><Sparkles /></div><div><span>NÃO ENCONTROU O QUE IMAGINOU?</span><h2>A gente também cria<br />uma peça só para você.</h2></div><a className="button light-button" href={INSTAGRAM} target="_blank" rel="noreferrer">Enviar minha ideia <MessageCircle /></a></section>
    </main>

    <footer><div className="container footer-grid"><div><BrandLogo /><p>Ideias ganham forma.<br />Detalhes ganham vida.</p></div><div><b>Navegue</b><a href="./index.html">Página inicial</a><a href="#catalogo">Catálogo</a><a href="./index.html#processo">Processo</a></div><div><b>Contato</b><a href={INSTAGRAM} target="_blank" rel="noreferrer"><InstagramIcon /> @rrlimpressoes3d</a><span>Orçamentos via Direct</span></div></div><div className="container copyright"><span>© 2026 RRL Impressões 3D · São José dos Campos - SP</span><span>Feito com precisão, camada por camada.</span></div></footer>
    <a className="floating-instagram" href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Pedir orçamento pelo Instagram"><InstagramIcon /><span>Pedir orçamento</span></a>
  </div>
}
