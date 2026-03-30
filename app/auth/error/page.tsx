import Link from "next/link"
import { Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <Link href="/" className="mx-auto flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">JBNet43</span>
          </Link>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl mt-4">Erreur d'authentification</CardTitle>
          <CardDescription>
            Une erreur est survenue lors de la connexion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Le lien de confirmation a peut-être expiré ou est invalide. 
            Veuillez réessayer ou contacter notre support.
          </p>

          <div className="flex flex-col gap-2">
            <Link href="/auth/login">
              <Button className="w-full">
                Réessayer la connexion
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button variant="outline" className="w-full">
                Créer un nouveau compte
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
