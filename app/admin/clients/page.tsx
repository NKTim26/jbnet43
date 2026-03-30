import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Mail, Phone, MapPin, Calendar } from "lucide-react"

export default async function AdminClientsPage() {
  const supabase = await createClient()

  // Fetch all client profiles
  const { data: clients } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "client")
    .order("created_at", { ascending: false })

  // Fetch appointment counts for each client
  const { data: appointments } = await supabase
    .from("appointments")
    .select("user_id")

  const appointmentCounts = appointments?.reduce((acc: Record<string, number>, apt) => {
    if (apt.user_id) {
      acc[apt.user_id] = (acc[apt.user_id] || 0) + 1
    }
    return acc
  }, {}) || {}

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          Clients
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gérez votre base de clients
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nouveaux ce mois
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients?.filter(c => {
                const createdAt = new Date(c.created_at)
                const now = new Date()
                return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()
              }).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avec réservations
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(appointmentCounts).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients List */}
      {!clients || clients.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">Aucun client pour le moment</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Les clients apparaîtront ici après leur inscription
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Liste des clients</CardTitle>
            <CardDescription>{clients.length} clients inscrits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Client</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Contact</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Adresse</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">RDV</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Inscrit le</th>
                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-secondary/30">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                            {(client.first_name?.[0] || "").toUpperCase()}{(client.last_name?.[0] || "").toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {client.first_name} {client.last_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="space-y-1">
                          {client.email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <a href={`mailto:${client.email}`} className="hover:text-primary">
                                {client.email}
                              </a>
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <a href={`tel:${client.phone}`} className="hover:text-primary">
                                {client.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        {client.address && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="max-w-48 truncate">{client.address}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium">
                          {appointmentCounts[client.id] || 0}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">
                        {new Date(client.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-4 text-right">
                        <Button variant="ghost" size="sm">
                          Voir
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
