import { Link } from 'react-router'

function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="text-muted-foreground">Pagina non trovata.</p>
      <Link to="/" className="text-primary underline">
        Torna alla home
      </Link>
    </section>
  )
}

export default NotFound
