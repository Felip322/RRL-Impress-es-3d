import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Menu, MessageCircle, PackageCheck, Search, Sparkles, X } from 'lucide-react'
import { formatPrice, type CatalogProduct } from './lib/catalog-data'
import { isSupabaseConfigured, supabase } from './lib/supabase'

const INSTAGRAM = 'https://www.instagram.com/rrlimpressoes3d'
const WHATSAPP = 'https://wa.me/5512981147499'

const whatsappUrl = (message: string) => `${WHATSAPP}?text=${encodeURIComponent(message)}`

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" stroke="none"/></svg>
}

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 9.5 9.5 0 0 1-4.1-1L3 21l1.6-4.6A9 9 0 1 1 21 11.5Z"/><path d="M8.2 8.1c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.8 1.9c.1.3.1.5-.1.7l-.6.7c-.2.2-.1.4 0 .6.7 1.2 1.6 2.1 2.9 2.7.2.1.4.1.6-.1l.8-1c.2-.2.4-.3.7-.2l1.9.9c.3.1.4.3.4.5 0 .4-.2 1.4-.7 1.9-.5.5-1.3.8-2.2.8-1.2 0-3.3-.7-5.3-2.5-1.5-1.4-2.7-3.5-2.8-5 0-.7.2-1.3.5-1.8Z"/></svg>
}

function BrandLogo() {
  return <a className="logo" href="./index.html#inicio" aria-label="RRL Impressões 3D - página inicial"><img className="brand-logo" src="/logo-oficial.png" alt="RRL Impressões 3D" /></a>
}

export default function Catalogo() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [category, setCategory] = useState('Todos')
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [loadingProducts, setLoadingProducts] = useState(isSupabaseConfigured)
  const [loadError, setLoadError] = useState(!isSupabaseConfigured)
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null)

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
      if (error) setLoadError(true)
      else if (data) {
        setProducts(data as CatalogProduct[])
        setLoadError(false)
      }
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

  useEffect(() => {
    if (!previewImage) return
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setPreviewImage(null)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [previewImage])

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
        <a className="header-cta" href={whatsappUrl('Olá! Gostaria de solicitar um orçamento.')} target="_blank" rel="noreferrer">Pedir orçamento <ArrowRight /></a>
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
            <p>Explore peças personalizadas, brinquedos, decoração e outras criações para presentear, colecionar ou usar no dia a dia.</p>
            <div className="catalog-trust"><span><PackageCheck /> Produção sob encomenda</span><span><Check /> Personalização disponível</span></div>
          </div>
          <div className="catalog-hero-art" aria-hidden="true"><span className="catalog-spark spark-one" /><span className="catalog-spark spark-two" /><img src="/conceito-cinetico.png" alt="" fetchPriority="high" /></div>
        </div>
      </section>

      <section className="catalog-listing container" id="catalogo">
        <div className="catalog-heading">
          <div><div className="section-tag">PEÇAS À VENDA</div><h2>Escolha uma criação.<br /><em>Deixe do seu jeito.</em></h2></div>
          <p>Modelos, cores e dimensões podem variar. Consulte o prazo, a disponibilidade e as opções de acabamento antes de confirmar seu pedido.</p>
        </div>

        <div className="catalog-toolbar">
          <div className="catalog-filters" role="group" aria-label="Filtrar por categoria">{categories.map(item => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <label className="catalog-search"><Search /><span className="sr-only">Buscar no catálogo</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar peça ou código" /></label>
        </div>

        <div className="catalog-count"><b>{String(filteredItems.length).padStart(2, '0')}</b> {loadingProducts ? 'carregando catálogo' : filteredItems.length === 1 ? 'peça encontrada' : 'peças encontradas'}</div>
        <div className="catalog-grid">
          {loadingProducts && Array.from({ length: 4 }, (_, index) => <article className="catalog-card catalog-card-skeleton" key={`loading-${index}`} aria-hidden="true"><div /><section><i /><i /><i /><i /></section></article>)}
          {!loadingProducts && filteredItems.map(item => <article className="catalog-card" key={item.id}>
            <div className="catalog-card-image"><img src={item.image_url} alt={item.name} loading="lazy" decoding="async" role="button" tabIndex={0} aria-label={`Ampliar imagem de ${item.name}`} onClick={() => setPreviewImage({ src: item.image_url, alt: item.name })} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setPreviewImage({ src: item.image_url, alt: item.name }) } }} /><span className={item.stock === 0 ? 'sold-out' : ''}><i /> {item.stock === 0 ? 'Esgotado' : item.status}</span><b>{item.category}</b></div>
            <div className="catalog-card-body"><div><span className="catalog-code">CÓDIGO <b>{item.code}</b></span><h3>{item.name}</h3><p>{item.description}</p></div><div className="catalog-price"><span>VALOR</span><strong>{formatPrice(item.price)}</strong>{item.stock !== null && <small>{item.stock} {item.stock === 1 ? 'unidade disponível' : 'unidades disponíveis'}</small>}</div><a href={whatsappUrl(`Olá! Tenho interesse no produto ${item.code} — ${item.name}. Gostaria de confirmar o valor, o prazo e a disponibilidade desse modelo.`)} target="_blank" rel="noreferrer" aria-label={`Tenho interesse no produto ${item.code} pelo WhatsApp`}>Tenho interesse <span>{item.code}</span><ArrowRight /></a></div>
          </article>)}
        </div>
        {!loadingProducts && filteredItems.length === 0 && <div className="catalog-empty"><Sparkles /><h3>{loadError ? 'Catálogo temporariamente indisponível.' : 'Nenhuma peça encontrada.'}</h3><p>{loadError ? 'Tente novamente em alguns instantes ou fale conosco pelo WhatsApp.' : 'Tente outra categoria ou termo de busca.'}</p></div>}
      </section>

      <section className="catalog-custom container"><div className="catalog-custom-icon"><Sparkles /></div><div><span>NÃO ENCONTROU O QUE IMAGINOU?</span><h2>A gente também cria<br />uma peça só para você.</h2></div><a className="button light-button" href={whatsappUrl('Olá! Tenho uma ideia de peça personalizada e gostaria de solicitar um orçamento.')} target="_blank" rel="noreferrer">Enviar minha ideia <MessageCircle /></a></section>
    </main>

    <footer><div className="container footer-grid"><div><BrandLogo /><p>Ideias ganham forma.<br />Detalhes ganham vida.</p></div><div><b>Navegue</b><a href="./index.html">Página inicial</a><a href="#catalogo">Catálogo</a><a href="./index.html#processo">Processo</a></div><div><b>Contato</b><a href={INSTAGRAM} target="_blank" rel="noreferrer"><InstagramIcon /> @rrlimpressoes3d</a><a href={whatsappUrl('Olá! Gostaria de solicitar um orçamento.')} target="_blank" rel="noreferrer"><WhatsAppIcon /> (12) 98114-7499</a></div></div><div className="container copyright"><span>© 2026 RRL Impressões 3D · São José dos Campos - SP</span><span>Feito com precisão, camada por camada.</span></div></footer>
    <a className="floating-instagram" href={whatsappUrl('Olá! Gostaria de solicitar um orçamento.')} target="_blank" rel="noreferrer" aria-label="Pedir orçamento pelo WhatsApp"><img src="/whatsapp-icon.png" alt="" /><span>Pedir orçamento</span></a>
    {previewImage && <div className="image-lightbox" role="dialog" aria-modal="true" aria-label={`Imagem ampliada: ${previewImage.alt}`} onClick={() => setPreviewImage(null)}><button type="button" onClick={() => setPreviewImage(null)} aria-label="Fechar imagem ampliada"><X /></button><img src={previewImage.src} alt={previewImage.alt} onClick={event => event.stopPropagation()} /></div>}
  </div>
}
