import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, FileText, TrendingUp, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch all appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .order("date", { ascending: true })

  // Fetch all profiles (clients)
  const { data: clients } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "client")

  // Fetch all invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false })

  const today = new Date().toISOString().split("T")[0]
  const todayAppointments = appointments?.filter(a => a.date === today) || []
  const pendingAppointments = appointments?.filter(a => a.status === "pending") || []
  const upcomingAppointments = appointments?.filter(
    a => new Date(a.date) >= new Date() && a.status !== "cancelled"
  ) || []

  const pendingInvoicesTotal = invoices?.filter(i => i.status === "pending").reduce((sum, i) => sum + i.amount, 0) || 0
  const thisMonthRevenue = invoices?.filter(i => {
    const invoiceDate = new Date(i.created_at)
    const now = new Date()
    return invoiceDate.getMonth() === now.getMonth() && invoiceDate.getFullYear() === now.getFullYear() && i.status === "paid"
  }).reduce((sum, i) => sum + i.amount, 0) || 0

  const getServiceName = (type: string) => {
    const services: Record<string, string> = {
      bureaux: "Bureaux",
      vitres: "Vitres",
      personne: "Personne",
      chantier: "Chantier",
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
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
        {labels[status] || status}
      </span>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          Tableau de bord
        </h1>
        <p className="mt-1 text-muted-foreground">
          Vue d'ensemble de votre activité JBNet43
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              RDV aujourd'hui
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingAppointments.length} en attente de confirmation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clients actifs
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Clients inscrits
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Factures en attente
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoicesTotal.toFixed(0)} €</div>
            <p className="text-xs text-muted-foreground">
              À encaisser
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              CA du mois
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonthRevenue.toFixed(0)} €</div>
            <p className="text-xs text-muted-foreground">
              Factures payées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/admin/calendar">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Calendar className="h-4 w-4" />
                  Voir le calendrier
                </Button>
              </Link>
              <Link href="/admin/clients">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" />
                  Gérer les clients
                </Button>
              </Link>
              <Link href="/admin/invoices">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  Créer une facture
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Clock className="h-4 w-4" />
                  Disponibilités
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Today's Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Rendez-vous du jour</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
              </CardDescription>
            </div>
            <Link href="/admin/calendar">
              <Button variant="ghost" size="sm" className="gap-1">
                Calendrier
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun rendez-vous aujourd'hui</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-primary">{appointment.time}</div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {appointment.client_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getServiceName(appointment.service_type)}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>À confirmer</CardTitle>
              <CardDescription>Demandes de réservation en attente</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {pendingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucune demande en attente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingAppointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {appointment.client_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(appointment.date).toLocaleDateString("fr-FR")} à {appointment.time} - {getServiceName(appointment.service_type)}
                      </p>
                    </div>
                    <Link href={`/admin/calendar?date=${appointment.date}`}>
                      <Button size="sm">Voir</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Prochains rendez-vous</CardTitle>
              <CardDescription>Les 7 prochains jours</CardDescription>
            </div>
            <Link href="/admin/calendar">
              <Button variant="ghost" size="sm" className="gap-1">
                Tout voir
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun rendez-vous à venir</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Heure</th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Client</th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Service</th>
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {upcomingAppointments.slice(0, 7).map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-secondary/30">
                        <td className="py-3 text-sm">
                          {new Date(appointment.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                        </td>
                        <td className="py-3 text-sm font-medium text-primary">{appointment.time}</td>
                        <td className="py-3 text-sm">{appointment.client_name}</td>
                        <td className="py-3 text-sm text-muted-foreground">{getServiceName(appointment.service_type)}</td>
                        <td className="py-3">{getStatusBadge(appointment.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
