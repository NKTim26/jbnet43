import { Building2, GlassWater, Heart, HardHat, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const services = [
  {
    icon: Building2,
    title: "Nettoyage de Bureaux",
    description: "Entretien régulier de vos locaux professionnels. Sols, surfaces, sanitaires et espaces communs maintenus impeccables.",
    features: ["Entretien quotidien ou hebdomadaire", "Désinfection des surfaces", "Gestion des déchets"],
    slug: "bureaux"
  },
  {
    icon: GlassWater,
    title: "Nettoyage de Vitres",
    description: "Vitres et surfaces vitrées étincelantes grâce à nos techniques professionnelles et notre équipement adapté.",
    features: ["Vitres intérieures et extérieures", "Vérandas et baies vitrées", "Accès difficiles"],
    slug: "vitres"
  },
  {
    icon: Heart,
    title: "Services à la Personne",
    description: "Aide ménagère et assistance à domicile pour les particuliers. Un service personnalisé et bienveillant.",
    features: ["Ménage à domicile", "Repassage", "Aide aux courses"],
    slug: "personne"
  },
  {
    icon: HardHat,
    title: "Remise en État",
    description: "Nettoyage complet après travaux de construction ou rénovation. Prêt à emménager sans effort.",
    features: ["Nettoyage post-chantier", "Élimination poussières fines", "Préparation à la livraison"],
    slug: "chantier"
  },
]

export function Services() {
  return (
    <section id="services" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Nos Services
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Des solutions de nettoyage adaptées à chaque besoin, avec un engagement qualité sans compromis.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <Card key={index} className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <service.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={`/booking?service=${service.slug}`} className="mt-6 block">
                  <Button variant="outline" className="w-full gap-2">
                    Réserver
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
