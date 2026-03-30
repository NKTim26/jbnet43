"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Settings, Clock, MapPin, Phone, Mail } from "lucide-react"

export default function AdminSettingsPage() {
  const [companyName, setCompanyName] = useState("JBNet43")
  const [phone, setPhone] = useState("06 00 00 00 00")
  const [email, setEmail] = useState("contact@jbnet43.fr")
  const [address, setAddress] = useState("Yssingeaux, Haute-Loire")
  const [workDays, setWorkDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  })
  const [workHours, setWorkHours] = useState({
    start: "08:00",
    end: "18:00",
  })
  const [saved, setSaved] = useState(false)

  const dayLabels: Record<string, string> = {
    monday: "Lundi",
    tuesday: "Mardi",
    wednesday: "Mercredi",
    thursday: "Jeudi",
    friday: "Vendredi",
    saturday: "Samedi",
    sunday: "Dimanche",
  }

  const handleSave = () => {
    // In a real app, this would save to the database
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          Paramètres
        </h1>
        <p className="mt-1 text-muted-foreground">
          Configurez votre entreprise et vos disponibilités
        </p>
      </div>

      <div className="grid gap-8">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Informations de l'entreprise
            </CardTitle>
            <CardDescription>
              Ces informations apparaissent sur le site et les factures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="companyName">Nom de l'entreprise</FieldLabel>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone
                  </FieldLabel>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Adresse
                  </FieldLabel>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Field>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horaires de travail
            </CardTitle>
            <CardDescription>
              Définissez vos jours et heures de disponibilité pour les réservations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="mb-4 text-sm font-medium text-foreground">Jours de travail</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(workDays).map(([day, isActive]) => (
                    <button
                      key={day}
                      onClick={() => setWorkDays({ ...workDays, [day]: !isActive })}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      {dayLabels[day]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="startTime">Heure de début</FieldLabel>
                  <Input
                    id="startTime"
                    type="time"
                    value={workHours.start}
                    onChange={(e) => setWorkHours({ ...workHours, start: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="endTime">Heure de fin</FieldLabel>
                  <Input
                    id="endTime"
                    type="time"
                    value={workHours.end}
                    onChange={(e) => setWorkHours({ ...workHours, end: e.target.value })}
                  />
                </Field>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Prices */}
        <Card>
          <CardHeader>
            <CardTitle>Tarifs des services</CardTitle>
            <CardDescription>
              Définissez vos tarifs horaires ou forfaitaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-medium text-foreground">Nettoyage de Bureaux</h3>
                <p className="mt-1 text-sm text-muted-foreground">Sur devis</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-medium text-foreground">Nettoyage de Vitres</h3>
                <p className="mt-1 text-sm text-muted-foreground">Sur devis</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-medium text-foreground">Services à la Personne</h3>
                <p className="mt-1 text-sm text-muted-foreground">À partir de 25€/h</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-medium text-foreground">Remise en État</h3>
                <p className="mt-1 text-sm text-muted-foreground">Sur devis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <Button onClick={handleSave}>
            Enregistrer les modifications
          </Button>
          {saved && (
            <p className="text-sm text-green-600">Paramètres enregistrés avec succès !</p>
          )}
        </div>
      </div>
    </div>
  )
}
