"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Sparkles, ArrowLeft, ArrowRight, Calendar, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { createClient } from "@/lib/supabase/client"

const services = [
  { id: "bureaux", name: "Nettoyage de Bureaux", icon: "Building2", price: "Sur devis" },
  { id: "vitres", name: "Nettoyage de Vitres", icon: "GlassWater", price: "Sur devis" },
  { id: "personne", name: "Services à la Personne", icon: "Heart", price: "À partir de 25€/h" },
  { id: "chantier", name: "Remise en État", icon: "HardHat", price: "Sur devis" },
]

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
]

function BookingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()
  
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState(searchParams.get("service") || "")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: string; email: string; user_metadata: Record<string, string> } | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user as { id: string; email: string; user_metadata: Record<string, string> })
        setName(`${user.user_metadata?.first_name || ""} ${user.user_metadata?.last_name || ""}`.trim())
        setEmail(user.email || "")
        setPhone(user.user_metadata?.phone || "")
        setAddress(user.user_metadata?.address || "")
      }
    }
    getUser()
  }, [supabase.auth])

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)

    try {
      const appointmentData = {
        service_type: selectedService,
        date: selectedDate,
        time: selectedTime,
        status: "pending",
        notes: notes || null,
        client_name: name,
        client_email: email,
        client_phone: phone,
        address,
        user_id: user?.id || null,
      }

      const { error: insertError } = await supabase
        .from("appointments")
        .insert(appointmentData)

      if (insertError) {
        throw insertError
      }

      setSuccess(true)
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl mt-4">Réservation envoyée !</CardTitle>
            <CardDescription>
              Nous avons bien reçu votre demande de réservation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-secondary/50 p-4 text-left">
              <p className="text-sm text-muted-foreground">
                <strong>Service :</strong> {services.find(s => s.id === selectedService)?.name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Date :</strong> {new Date(selectedDate).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Heure :</strong> {selectedTime}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Nous vous contacterons dans les 24h pour confirmer votre rendez-vous.
            </p>
            <div className="flex flex-col gap-2 pt-4">
              {user ? (
                <Button onClick={() => router.push("/dashboard")} className="w-full">
                  Voir mes réservations
                </Button>
              ) : (
                <Button onClick={() => router.push("/auth/sign-up")} className="w-full">
                  Créer un compte
                </Button>
              )}
              <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                Retour à l'accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">JBNet43</span>
          </Link>
          {!user && (
            <Link href="/auth/login">
              <Button variant="outline" size="sm">Connexion</Button>
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-foreground">Réserver un service</h1>
          <p className="mt-2 text-muted-foreground">
            Sélectionnez votre service et choisissez un créneau disponible
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step >= s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}>
                {s}
              </div>
              <span className={`hidden sm:block text-sm ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                {s === 1 ? "Service" : s === 2 ? "Date & Heure" : "Coordonnées"}
              </span>
              {s < 3 && <div className="h-px w-8 bg-border" />}
            </div>
          ))}
        </div>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Choisissez un service</CardTitle>
              <CardDescription>Sélectionnez le type de prestation souhaitée</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`rounded-lg border p-4 text-left transition-all hover:border-primary ${
                      selectedService === service.id ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <h3 className="font-semibold text-foreground">{service.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{service.price}</p>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!selectedService}>
                  Continuer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Date & Time Selection */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Choisissez une date et heure</CardTitle>
              <CardDescription>Sélectionnez un créneau disponible</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date souhaitée
                  </FieldLabel>
                  <Input
                    id="date"
                    type="date"
                    min={getMinDate()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Heure souhaitée
                  </FieldLabel>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-lg border px-3 py-2 text-sm transition-all hover:border-primary ${
                          selectedTime === time ? "border-primary bg-primary text-primary-foreground" : "border-border"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </Field>
              </FieldGroup>
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
                <Button onClick={() => setStep(3)} disabled={!selectedDate || !selectedTime}>
                  Continuer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Contact Information */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Vos coordonnées</CardTitle>
              <CardDescription>Renseignez vos informations de contact</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="name">Nom complet</FieldLabel>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jean Dupont"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.fr"
                      required
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="phone">Téléphone</FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06 00 00 00 00"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="address">Adresse d'intervention</FieldLabel>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Rue de la Paix, 43200 Yssingeaux"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="notes">Notes supplémentaires (optionnel)</FieldLabel>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Précisions sur le service, code d'accès, etc."
                    rows={3}
                  />
                </Field>
              </FieldGroup>

              {error && (
                <p className="mt-4 text-sm text-destructive">{error}</p>
              )}

              <div className="mt-6 rounded-lg bg-secondary/50 p-4">
                <h3 className="font-semibold text-foreground">Récapitulatif</h3>
                <div className="mt-2 text-sm text-muted-foreground space-y-1">
                  <p><strong>Service :</strong> {services.find(s => s.id === selectedService)?.name}</p>
                  <p><strong>Date :</strong> {new Date(selectedDate).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                  <p><strong>Heure :</strong> {selectedTime}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading || !name || !email || !phone || !address}
                >
                  {loading ? "Envoi..." : "Confirmer la réservation"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <BookingContent />
    </Suspense>
  )
}
