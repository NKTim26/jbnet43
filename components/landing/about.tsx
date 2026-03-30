import { Shield, Clock, Award, Users } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Fiabilité",
    description: "Des interventions régulières et ponctuelles, avec une équipe de confiance formée aux meilleures pratiques.",
  },
  {
    icon: Clock,
    title: "Flexibilité",
    description: "Horaires adaptés à vos contraintes. Interventions en journée, soirée ou week-end selon vos besoins.",
  },
  {
    icon: Award,
    title: "Qualité",
    description: "Produits professionnels et matériel de pointe pour des résultats impeccables à chaque passage.",
  },
  {
    icon: Users,
    title: "Proximité",
    description: "Entreprise locale basée à Yssingeaux, nous connaissons et servons notre région avec engagement.",
  },
]

export function About() {
  return (
    <section id="about" className="bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Pourquoi choisir JBNet43 ?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Depuis plus de 10 ans, JBNet43 accompagne les entreprises et les particuliers de la région 
              d'Yssingeaux dans leurs besoins de nettoyage. Notre engagement : un service professionnel, 
              fiable et adapté à chaque situation.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Notre équipe qualifiée utilise des produits respectueux de l'environnement et des 
              techniques éprouvées pour garantir des résultats à la hauteur de vos attentes.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature, index) => (
              <div key={index} className="rounded-xl bg-background p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
