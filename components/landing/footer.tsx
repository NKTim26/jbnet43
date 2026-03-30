import Link from "next/link"
import { Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">JBNet43</span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Services de nettoyage professionnel pour entreprises et particuliers à Yssingeaux 
              et ses environs. Qualité, fiabilité et proximité depuis plus de 10 ans.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">Services</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/booking?service=bureaux" className="text-sm text-muted-foreground hover:text-primary">
                  Nettoyage de Bureaux
                </Link>
              </li>
              <li>
                <Link href="/booking?service=vitres" className="text-sm text-muted-foreground hover:text-primary">
                  Nettoyage de Vitres
                </Link>
              </li>
              <li>
                <Link href="/booking?service=personne" className="text-sm text-muted-foreground hover:text-primary">
                  Services à la Personne
                </Link>
              </li>
              <li>
                <Link href="/booking?service=chantier" className="text-sm text-muted-foreground hover:text-primary">
                  Remise en État
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">Liens Utiles</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-primary">
                  Espace Client
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-sm text-muted-foreground hover:text-primary">
                  Réserver en Ligne
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-sm text-muted-foreground hover:text-primary">
                  Mentions Légales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} JBNet43. Tous droits réservés. Yssingeaux, Haute-Loire.
          </p>
        </div>
      </div>
    </footer>
  )
}
