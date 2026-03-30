import Link from "next/link"
import { Sparkles, Mail, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpSuccessPage() {
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
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl mt-4">Inscription réussie !</CardTitle>
          <CardDescription>
            Votre compte a été créé avec succès
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-secondary/50 p-4">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Mail className="h-5 w-5" />
              <span className="font-medium">Vérifiez votre boîte mail</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Nous vous avons envoyé un email de confirmation. 
              Cliquez sur le lien pour activer votre compte.
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Vous n'avez pas reçu l'email ?</p>
            <p className="mt-1">Vérifiez vos spams ou contactez-nous.</p>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/auth/login">
              <Button className="w-full">
                Se connecter
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
