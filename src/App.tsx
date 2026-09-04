import { useEffect, useState } from 'react'
import {
  ArrowRight, Check, ChevronDown, Cpu, ExternalLink, Gift,
  Layers3, Menu, MessageCircle, Palette, Ruler, Sparkles, X
} from 'lucide-react'

const INSTAGRAM = 'https://www.instagram.com/rrlimpressoes3d'
const WHATSAPP = 'https://wa.me/5512981147499?text=Ol%C3%A1%21%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento.'
const MARQUEE_ITEMS = ['PERSONALIZAÇÃO', 'CRIATIVIDADE', 'PRECISÃO', 'TECNOLOGIA', 'ACABAMENTO', 'EXCLUSIVIDADE']
const PROJECTS = [
  { image: '/projeto-instagram-01.jpg', url: 'https://www.instagram.com/p/Dcy3okcCfEj/', category: 'PERSONALIZADO', title: 'Peça temática multicolorida', alt: 'Peça temática amarela e preta produzida pela RRL' },
  { image: '/projeto-instagram-02.jpg', url: 'https://www.instagram.com/p/Dcybwk3RFQI/', category: 'ARTICULADO', title: 'Criatura em filamento brilhante', alt: 'Criatura articulada verde produzida em impressão 3D' },
  { image: '/projeto-instagram-03.jpg', url: 'https://www.instagram.com/p/DcyeD1vEe5i/', category: 'BASTIDORES', title: 'Preparação de modelo 3D', alt: 'Modelo de estrela-do-mar sendo preparado para impressão' },
  { image: '/projeto-instagram-04.jpg', url: 'https://www.instagram.com/p/DcyZVfHEX1Y/', category: 'ARTE CINÉTICA', title: 'Efeito visual multicolorido', alt: 'Peça cinética multicolorida em formato geométrico' },
]

function Instagram({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" stroke="none"/></svg>
}

function WhatsApp() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 9.5 9.5 0 0 1-4.1-1L3 21l1.6-4.6A9 9 0 1 1 21 11.5Z"/><path d="M8.2 8.1c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.8 1.9c.1.3.1.5-.1.7l-.6.7c-.2.2-.1.4 0 .6.7 1.2 1.6 2.1 2.9 2.7.2.1.4.1.6-.1l.8-1c.2-.2.4-.3.7-.2l1.9.9c.3.1.4.3.4.5 0 .4-.2 1.4-.7 1.9-.5.5-1.3.8-2.2.8-1.2 0-3.3-.7-5.3-2.5-1.5-1.4-2.7-3.5-2.8-5 0-.7.2-1.3.5-1.8Z"/></svg>
}

function Logo() {
  return <a className="logo" href="#inicio" aria-label="RRL Impressões 3D - início">
    <img className="brand-logo" src="/logo-oficial.png" alt="RRL Impressões 3D" />
  </a>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [faq, setFaq] = useState(0)

  useEffect(() => {
    const root = document.documentElement
    const onScroll = () => {
      setScrolled(window.scrollY > 30)
      const max = document.documentElement.scrollHeight - window.innerHeight
      root.style.setProperty('--scroll-progress', `${max > 0 ? (window.scrollY / max) * 100 : 0}%`)
    }
    const onPointer = (event: PointerEvent) => {
      root.style.setProperty('--cursor-x', `${event.clientX}px`)
      root.style.setProperty('--cursor-y', `${event.clientY}px`)
      root.style.setProperty('--hero-x', `${(event.clientX / window.innerWidth - .5) * -18}px`)
      root.style.setProperty('--hero-y', `${(event.clientY / window.innerHeight - .5) * -12}px`)
    }
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('main > section:not(.hero):not(.marquee), .section-head, .intro-grid, .metrics, .service-grid article, .possibility, .project-card, .project-callout, .steps article, .quality li, .faq-list, footer .footer-grid'))
    revealItems.forEach((item, index) => {
      item.classList.add('reveal')
      item.style.setProperty('--reveal-delay', `${(index % 3) * 70}ms`)
    })
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed')
        observer.unobserve(entry.target)
      }
    }), { threshold: .12, rootMargin: '0px 0px -7% 0px' })
    revealItems.forEach(item => observer.observe(item))

    const tiltItems = Array.from(document.querySelectorAll<HTMLElement>('.service-grid article, .possibility, .project-card, .project-callout, .intro-showcase'))
    const tiltCleanups = tiltItems.map(item => {
      item.classList.add('tilt-card')
      const move = (event: PointerEvent) => {
        const rect = item.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width
        const y = (event.clientY - rect.top) / rect.height
        item.style.setProperty('--tilt-x', `${(x - .5) * 5}deg`)
        item.style.setProperty('--tilt-y', `${(.5 - y) * 5}deg`)
        item.style.setProperty('--shine-x', `${x * 100}%`)
        item.style.setProperty('--shine-y', `${y * 100}%`)
      }
      const leave = () => {
        item.style.setProperty('--tilt-x', '0deg')
        item.style.setProperty('--tilt-y', '0deg')
      }
      item.addEventListener('pointermove', move)
      item.addEventListener('pointerleave', leave)
      return () => { item.removeEventListener('pointermove', move); item.removeEventListener('pointerleave', leave) }
    })

    const frame = requestAnimationFrame(() => root.classList.add('motion-ready'))
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      tiltCleanups.forEach(cleanup => cleanup())
      root.classList.remove('motion-ready')
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const closeOnDesktop = () => {
      if (window.innerWidth > 900) setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    window.addEventListener('resize', closeOnDesktop)
    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('resize', closeOnDesktop)
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)
  const services = [
    { icon: Gift, number: '01', title: 'Presentes personalizados', text: 'Peças únicas para transformar datas especiais em memórias que ficam.' },
    { icon: Palette, number: '02', title: 'Decoração criativa', text: 'Objetos com personalidade, cores e medidas pensadas para o seu espaço.' },
    { icon: Ruler, number: '03', title: 'Projetos sob medida', text: 'Da referência à peça pronta, criamos soluções exclusivas para a sua ideia.' },
    { icon: Cpu, number: '04', title: 'Peças funcionais', text: 'Suportes, organizadores, reposições e protótipos com precisão nos detalhes.' },
  ]
  const questions = [
    ['Como faço um orçamento?', 'Envie uma mensagem pelo WhatsApp com uma foto, referência ou descrição da ideia. Se souber as medidas, envie também — isso agiliza a avaliação.'],
    ['Vocês fazem peças personalizadas?', 'Sim. Personalização é uma das nossas especialidades: ajustamos modelo, cor, tamanho e detalhes conforme a necessidade do projeto.'],
    ['Qual é o prazo de produção?', 'O prazo varia conforme tamanho, complexidade, acabamento e fila de produção. A previsão é informada antes da confirmação do pedido.'],
    ['Posso enviar meu próprio arquivo 3D?', 'Sim. Envie o arquivo para avaliarmos dimensões, material, tempo de impressão e eventuais ajustes necessários.'],
  ]

  return <div className="site-shell">
    <div className="cursor-aura" aria-hidden="true" />
    <header className={scrolled ? 'header scrolled' : 'header'}>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="nav-container">
        <Logo />
        <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Navegação principal">
          {[['Início', '#inicio'], ['Soluções', '#solucoes'], ['Projetos', '#projetos'], ['Processo', '#processo'], ['Sobre', '#sobre'], ['Catálogo', './catalogo.html']].map(([item, href]) =>
            <a key={item} href={href} onClick={closeMenu}>{item}</a>
          )}
        </nav>
        <a className="header-cta" href={WHATSAPP} target="_blank" rel="noreferrer">Pedir orçamento <ArrowRight /></a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>
    {menuOpen && <button className="menu-backdrop" onClick={closeMenu} aria-label="Fechar menu" />}

    <main>
      <section className="hero" id="inicio">
        <div className="hero-media"><img src="/hero-rrl.png" alt="Seleção de peças produzidas em impressão 3D" fetchPriority="high" /></div>
        <div className="hero-glow" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="print-scan" aria-hidden="true" />
        <div className="magic-particles" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</div>
        <div className="hero-content container">
          <div className="eyebrow"><span /> Impressão 3D personalizada</div>
          <h1>Sua ideia.<br /><em>Em outra dimensão.</em></h1>
          <p>Transformamos referências, necessidades e imaginação em peças 3D únicas — feitas com cuidado, precisão e personalidade.</p>
          <div className="hero-actions">
            <a className="button primary" href={WHATSAPP} target="_blank" rel="noreferrer">Quero criar minha peça <ArrowRight /></a>
            <a className="button ghost" href="#projetos">Ver projetos <ChevronDown /></a>
          </div>
          <div className="hero-features">
            <span><Check /> Personalizado</span><span><Check /> Sob encomenda</span><span><Check /> Feito com cuidado</span>
          </div>
        </div>
        <div className="hero-tech-card tech-one"><Layers3 /><span><b>Camada por camada</b><small>Precisão que ganha forma</small></span></div>
        <div className="hero-tech-card tech-two"><Sparkles /><span><b>Feito para você</b><small>Cada peça é uma descoberta</small></span></div>
        <div className="scroll-note"><span>EXPLORE</span><i /></div>
      </section>

      <section className="marquee" aria-label="Nossas especialidades">
        <div>{[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => <span key={`${item}-${index}`}>{item}<i /></span>)}</div>
      </section>

      <section className="intro container" id="sobre">
        <div className="section-tag">01 — O QUE FAZEMOS</div>
        <div className="intro-grid">
          <div className="intro-heading"><h2>Da imaginação<br />para <em>suas mãos.</em></h2><div className="intro-art" aria-hidden="true"><span /><img src="/imaginacao-para-realidade.png" alt="" loading="lazy" decoding="async" /></div></div>
          <div><p className="lead">Mais do que imprimir objetos, damos forma a ideias que ainda não existem.</p><p>Cada projeto recebe atenção aos detalhes, escolha de material e acabamento para chegar a um resultado que tenha a sua cara e cumpra seu propósito.</p><a className="text-link" href={INSTAGRAM} target="_blank" rel="noreferrer">Conheça nosso Instagram <ExternalLink /></a></div>
        </div>
        <div className="metrics"><div><strong>100%</strong><span>personalizável</span></div><div><strong>3D</strong><span>feito camada por camada</span></div><div><strong>1:1</strong><span>atendimento próximo</span></div></div>
        <div className="intro-showcase"><img src="/conceito-decoracao.png" alt="Conceito ilustrativo de objetos decorativos produzidos em impressão 3D" loading="lazy" decoding="async" /><div><span>DECORAÇÃO & UTILIDADE</span><h3>Peças que transformam<br />o ambiente.</h3><small>VISUAL ILUSTRATIVO</small></div></div>
      </section>

      <section className="services" id="solucoes">
        <div className="container">
          <div className="section-head"><div><div className="section-tag light">02 — POSSIBILIDADES</div><h2>O que podemos<br /><em>criar juntos.</em></h2></div><p>Se você consegue imaginar, nós buscamos o melhor caminho para materializar.</p></div>
          <div className="service-grid">{services.map(({ icon: Icon, number, title, text }) => <article key={title}><span>{number}</span><Icon /><h3>{title}</h3><p>{text}</p><a href={WHATSAPP} target="_blank" rel="noreferrer" aria-label={`Orçamento para ${title} pelo WhatsApp`}><ArrowRight /></a></article>)}</div>
        </div>
      </section>

      <section className="possibilities">
        <div className="container">
          <div className="possibilities-head"><div><div className="section-tag">03 — IDEIAS QUE GANHAM FORMA</div><h2>Imagine as<br /><em>possibilidades.</em></h2></div><div><p>De objetos articulados a peças decorativas e presentes: cada criação pode combinar forma, movimento, cor e personalidade.</p><small>VISUAIS ILUSTRATIVOS INSPIRADOS EM NOSSAS CATEGORIAS</small></div></div>
          <div className="possibilities-grid">
            <article className="possibility possibility-main"><img src="/conceito-articulado.png" alt="Conceito ilustrativo de criatura articulada impressa em 3D" loading="lazy" decoding="async" /><div><span>ARTICULADOS</span><h3>Movimento em<br />cada detalhe.</h3><p>Personagens e criaturas que saem prontos para ganhar vida nas suas mãos.</p></div></article>
            <article className="possibility"><img src="/conceito-cinetico.png" alt="Conceito ilustrativo de escultura cinética impressa em 3D" loading="lazy" decoding="async" /><div><span>DECORAÇÃO</span><h3>Formas que surpreendem.</h3></div></article>
            <article className="possibility possibility-wide"><img src="/conceito-personalizados.png" alt="Conceito ilustrativo de presentes personalizados impressos em 3D" loading="lazy" decoding="async" /><div><span>PERSONALIZADOS</span><h3>Um presente que só<br />poderia ser de alguém.</h3></div></article>
          </div>
        </div>
      </section>

      <section className="projects container" id="projetos">
        <div className="section-head dark"><div><div className="section-tag">04 — PROJETOS REAIS</div><h2>Detalhes que fazem<br />cada peça <em>única.</em></h2></div><a className="text-link" href={INSTAGRAM} target="_blank" rel="noreferrer">Ver todos no Instagram <Instagram /></a></div>
        <div className="mobile-swipe-hint"><span>DESLIZE PARA EXPLORAR</span><ArrowRight /></div>
        <div className="project-grid">
          {PROJECTS.map((project, index) => <a className={`project-card project-${index + 1}`} href={project.url} target="_blank" rel="noreferrer" key={project.url}><img src={project.image} alt={project.alt} loading="lazy" decoding="async" /><div className="project-shade"/><div className="project-info"><span>{project.category}</span><h3>{project.title}</h3><b>Ver publicação <ExternalLink /></b></div><div className="real-badge"><span /> PROJETO RRL</div></a>)}
          <article className="project-callout"><Layers3 /><span>SEU PROJETO AQUI</span><h3>Tem uma ideia<br />diferente?</h3><p>Mande uma referência. Vamos conversar sobre medidas, cores e possibilidades.</p><a className="button primary" href={WHATSAPP} target="_blank" rel="noreferrer">Enviar minha ideia <ArrowRight /></a></article>
        </div>
      </section>

      <section className="process" id="processo">
        <div className="container process-grid"><div><div className="section-tag light">05 — COMO FUNCIONA</div><h2>Simples para você.<br /><em>Preciso em cada etapa.</em></h2><p>Do primeiro contato até a peça pronta, você acompanha um processo claro e sem complicação.</p></div><div className="steps">
          {[['01', 'Conte sua ideia', 'Envie uma referência, arquivo ou explique o que precisa.'], ['02', 'Definimos os detalhes', 'Alinhamos medidas, cores, material, acabamento e prazo.'], ['03', 'Produzimos sua peça', 'Sua ideia ganha forma, camada por camada, com atenção.'], ['04', 'Pronto para você', 'Conferimos o resultado e combinamos a entrega.']].map(([n,t,p]) => <article key={n}><b>{n}</b><div><h3>{t}</h3><p>{p}</p></div></article>)}
        </div></div>
      </section>

      <section className="quality container">
        <div className="quality-visual quality-photo"><img src="/conceito-processo.png" alt="Conceito ilustrativo do processo de impressão 3D" loading="lazy" decoding="async" /><span>VISUAL ILUSTRATIVO</span></div>
        <div><div className="section-tag">06 — NOSSO CUIDADO</div><h2>Tecnologia com<br /><em>olhar artesanal.</em></h2><p>Uma boa impressão começa antes de ligar a máquina. Analisamos o modelo, preparamos cada configuração e acompanhamos a produção para entregar uma peça bem resolvida.</p><ul><li><Check /> Avaliação de cada projeto</li><li><Check /> Escolha cuidadosa de cores e materiais</li><li><Check /> Atenção ao acabamento final</li></ul></div>
      </section>

      <section className="faq container" id="faq"><div className="faq-intro"><div className="section-tag">07 — DÚVIDAS</div><h2>Antes de<br /><em>começar.</em></h2><p>Não encontrou sua dúvida? Fale diretamente com a gente.</p><div className="faq-art" aria-hidden="true"><span className="faq-art-orbit orbit-a" /><span className="faq-art-orbit orbit-b" /><span className="faq-art-spark spark-a" /><span className="faq-art-spark spark-b" /><img src="/faq-question-sculpture.png" alt="" loading="lazy" decoding="async" /><small>PERGUNTE. A GENTE MATERIALIZA.</small></div></div><div className="faq-list">{questions.map(([q,a], i) => <button key={q} onClick={() => setFaq(faq === i ? -1 : i)} className={faq === i ? 'active' : ''} aria-expanded={faq === i}><span><b>{q}</b>{faq === i && <p>{a}</p>}</span><i aria-hidden="true">{faq === i ? '−' : '+'}</i></button>)}</div></section>

      <section className="final-cta container"><div className="cta-icon"><Sparkles /></div><div><span>VAMOS TIRAR SUA IDEIA DO PAPEL?</span><h2>Sua próxima criação<br />começa com uma mensagem.</h2></div><a className="button light-button" href={WHATSAPP} target="_blank" rel="noreferrer">Pedir orçamento <MessageCircle /></a></section>
    </main>

    <footer><div className="container footer-grid"><div><Logo /><p>Ideias ganham forma.<br />Detalhes ganham vida.</p></div><div><b>Navegue</b><a href="#solucoes">Soluções</a><a href="#projetos">Projetos</a><a href="./catalogo.html">Catálogo</a><a href="#processo">Processo</a></div><div><b>Contato</b><a href={INSTAGRAM} target="_blank" rel="noreferrer"><Instagram /> @rrlimpressoes3d</a><a href={WHATSAPP} target="_blank" rel="noreferrer"><WhatsApp /> (12) 98114-7499</a></div></div><div className="container copyright"><span>© 2026 RRL Impressões 3D · São José dos Campos - SP</span><span>Feito com precisão, camada por camada.</span></div></footer>
    <a className="floating-instagram" href={WHATSAPP} target="_blank" rel="noreferrer" aria-label="Pedir orçamento pelo WhatsApp"><WhatsApp /><span>Pedir orçamento</span></a>
  </div>
}

export default App
