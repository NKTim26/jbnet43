import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Contactez-nous
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Une question, un devis ? Notre équipe est à votre écoute pour répondre à vos besoins.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Nos Coordonnées</CardTitle>
              <CardDescription>Retrouvez-nous à Yssingeaux</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Adresse</p>
                  <p className="text-sm text-muted-foreground">
                    Yssingeaux, Haute-Loire<br />
                    Auvergne-Rhône-Alpes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Téléphone</p>
                  <a href="tel:+33788429319" className="text-sm text-muted-foreground hover:text-primary">
                    07 88 42 93 19
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <a href="mailto:jbnet@gmail.com" className="text-sm text-muted-foreground hover:text-primary">
                    jbnet@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Horaires</p>
                  <p className="text-sm text-muted-foreground">
                    Lun - Ven : 8h00 - 18h00<br />
                    Sam : Sur rendez-vous
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Demande de Devis Gratuit</CardTitle>
              <CardDescription>
                Remplissez le formulaire ou réservez directement en ligne
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-secondary/30 p-6 text-center">
                  <h3 className="font-semibold text-foreground">Réservation en Ligne</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Réservez votre créneau directement sur notre plateforme
                  </p>
                  <Link href="/booking" className="mt-4 block">
                    <Button className="w-full">Réserver maintenant</Button>
                  </Link>
                </div>
                <div className="rounded-xl border border-border bg-secondary/30 p-6 text-center">
                  <h3 className="font-semibold text-foreground">Devis Personnalisé</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Contactez-nous pour un devis adapté à vos besoins
                  </p>
                  <a href="tel:+33600000000" className="mt-4 block">
                    <Button variant="outline" className="w-full">Nous appeler</Button>
                  </a>
                </div>
              </div>

              <div className="mt-8 rounded-xl bg-primary/5 p-6">
                <h3 className="font-semibold text-foreground">Zone d'intervention</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Nous intervenons à Yssingeaux et dans un rayon de 30 km : Le Puy-en-Velay,
                  Monistrol-sur-Loire, Tence, Saint-Didier-en-Velay, et communes avoisinantes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
