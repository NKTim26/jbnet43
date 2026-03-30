import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-20 sm:py-28 lg:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <CheckCircle className="h-4 w-4" />
            Services professionnels depuis Yssingeaux
          </div>
          
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Nettoyage professionnel pour{" "}
            <span className="text-primary">entreprises et particuliers</span>
          </h1>
          
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            JBNet43 vous accompagne dans tous vos besoins de nettoyage : bureaux, vitres, 
            remise en état après travaux et services à la personne. Qualité et fiabilité garanties.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/booking">
              <Button size="lg" className="gap-2">
                Réserver un service
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#services">
              <Button variant="outline" size="lg">
                Découvrir nos services
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: "500+", label: "Clients satisfaits" },
              { value: "10+", label: "Années d'expérience" },
              { value: "100%", label: "Satisfaction client" },
              { value: "24/7", label: "Support disponible" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-primary sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
