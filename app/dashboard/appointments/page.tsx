import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Plus } from "lucide-react"
import Link from "next/link"

export default async function AppointmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", user?.id)
    .order("date", { ascending: false })

  const getServiceName = (type: string) => {
    const services: Record<string, string> = {
      bureaux: "Nettoyage de Bureaux",
      vitres: "Nettoyage de Vitres",
      personne: "Services à la Personne",
      chantier: "Remise en État",
    }
    return services[type] || type
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    }
    const labels: Record<string, string> = {
      pending: "En attente",
      confirmed: "Confirmé",
      completed: "Terminé",
      cancelled: "Annulé",
    }
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
        {labels[status] || status}
      </span>
    )
  }

  const upcomingAppointments = appointments?.filter(
    (a) => new Date(a.date) >= new Date() && a.status !== "cancelled"
  ) || []

  const pastAppointments = appointments?.filter(
    (a) => new Date(a.date) < new Date() || a.status === "cancelled"
  ) || []

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            Mes rendez-vous
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gérez vos interventions passées et à venir
          </p>
        </div>
        <Link href="/booking">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle réservation
          </Button>
        </Link>
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">À venir</h2>
        {upcomingAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">Aucun rendez-vous à venir</p>
              <Link href="/booking" className="mt-4 inline-block">
                <Button>Réserver un service</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {getServiceName(appointment.service_type)}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Réservé le {new Date(appointment.created_at).toLocaleDateString("fr-FR")}
                      </CardDescription>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(appointment.date).toLocaleDateString("fr-FR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{appointment.address}</span>
                    </div>
                  </div>
                  {appointment.notes && (
                    <div className="mt-4 rounded-lg bg-secondary/50 p-3">
                      <p className="text-sm text-muted-foreground">
                        <strong>Notes :</strong> {appointment.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Historique</h2>
          <div className="grid gap-4">
            {pastAppointments.map((appointment) => (
              <Card key={appointment.id} className="opacity-75">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {getServiceName(appointment.service_type)}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {new Date(appointment.date).toLocaleDateString("fr-FR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })} à {appointment.time}
                      </CardDescription>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{appointment.address}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
