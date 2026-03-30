"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Check, Clock, MapPin, Phone, Mail, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Appointment {
  id: string
  date: string
  time: string
  service_type: string
  status: string
  client_name: string
  client_email: string
  client_phone: string
  address: string
  notes: string | null
  user_id: string | null
  created_at: string
}

function CalendarContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()
  
  const initialDate = searchParams.get("date")
  const [currentDate, setCurrentDate] = useState(initialDate ? new Date(initialDate) : new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [currentDate])

  const fetchAppointments = async () => {
    setLoading(true)
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    const { data } = await supabase
      .from("appointments")
      .select("*")
      .gte("date", startOfMonth.toISOString().split("T")[0])
      .lte("date", endOfMonth.toISOString().split("T")[0])
      .order("time", { ascending: true })

    setAppointments(data || [])
    setLoading(false)
  }

  const updateAppointmentStatus = async (id: string, status: string) => {
    await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)

    fetchAppointments()
    if (selectedAppointment?.id === id) {
      setSelectedAppointment({ ...selectedAppointment, status })
    }
  }

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getAppointmentsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return appointments.filter(a => a.date === dateStr)
  }

  const getServiceName = (type: string) => {
    const services: Record<string, string> = {
      bureaux: "Bureaux",
      vitres: "Vitres",
      personne: "Personne",
      chantier: "Chantier",
    }
    return services[type] || type
  }

  const getServiceFullName = (type: string) => {
    const services: Record<string, string> = {
      bureaux: "Nettoyage de Bureaux",
      vitres: "Nettoyage de Vitres",
      personne: "Services à la Personne",
      chantier: "Remise en État",
    }
    return services[type] || type
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500",
      confirmed: "bg-green-500",
      completed: "bg-blue-500",
      cancelled: "bg-red-500",
    }
    return colors[status] || "bg-gray-500"
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

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          Calendrier
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gérez vos rendez-vous et planning
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="capitalize">
                {currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Aujourd'hui
              </Button>
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-96 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {/* Week days header */}
                {weekDays.map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}

                {/* Empty cells for days before the first day of month */}
                {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-24 rounded-lg bg-secondary/20 p-1" />
                ))}

                {/* Days of month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const dayAppointments = getAppointmentsForDay(day)
                  return (
                    <div
                      key={day}
                      className={`min-h-24 rounded-lg border p-1 transition-colors hover:bg-secondary/30 ${
                        isToday(day) ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <div className={`mb-1 text-sm font-medium ${isToday(day) ? "text-primary" : "text-foreground"}`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 3).map((apt) => (
                          <button
                            key={apt.id}
                            onClick={() => setSelectedAppointment(apt)}
                            className="flex w-full items-center gap-1 rounded px-1 py-0.5 text-left text-xs transition-colors hover:bg-secondary"
                          >
                            <div className={`h-2 w-2 rounded-full ${getStatusColor(apt.status)}`} />
                            <span className="truncate">{apt.time} {getServiceName(apt.service_type)}</span>
                          </button>
                        ))}
                        {dayAppointments.length > 3 && (
                          <div className="text-xs text-muted-foreground px-1">
                            +{dayAppointments.length - 3} autres
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appointment Details Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Détails du rendez-vous</CardTitle>
            <CardDescription>
              {selectedAppointment
                ? `${new Date(selectedAppointment.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}`
                : "Sélectionnez un rendez-vous"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedAppointment ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    {getServiceFullName(selectedAppointment.service_type)}
                  </h3>
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedAppointment.time}</span>
                    {getStatusBadge(selectedAppointment.status)}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedAppointment.client_name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${selectedAppointment.client_email}`} className="hover:text-primary">
                      {selectedAppointment.client_email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${selectedAppointment.client_phone}`} className="hover:text-primary">
                      {selectedAppointment.client_phone}
                    </a>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{selectedAppointment.address}</span>
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <p className="text-sm text-muted-foreground">
                      <strong>Notes :</strong> {selectedAppointment.notes}
                    </p>
                  </div>
                )}

                <div className="border-t border-border pt-4">
                  <p className="mb-3 text-sm font-medium text-muted-foreground">Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedAppointment.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateAppointmentStatus(selectedAppointment.id, "confirmed")}
                          className="gap-1"
                        >
                          <Check className="h-4 w-4" />
                          Confirmer
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateAppointmentStatus(selectedAppointment.id, "cancelled")}
                          className="gap-1"
                        >
                          <X className="h-4 w-4" />
                          Annuler
                        </Button>
                      </>
                    )}
                    {selectedAppointment.status === "confirmed" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateAppointmentStatus(selectedAppointment.id, "completed")}
                          className="gap-1"
                        >
                          <Check className="h-4 w-4" />
                          Terminer
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateAppointmentStatus(selectedAppointment.id, "cancelled")}
                          className="gap-1"
                        >
                          <X className="h-4 w-4" />
                          Annuler
                        </Button>
                      </>
                    )}
                    {(selectedAppointment.status === "completed" || selectedAppointment.status === "cancelled") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateAppointmentStatus(selectedAppointment.id, "pending")}
                        className="col-span-2"
                      >
                        Réouvrir
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center text-center">
                <div>
                  <p className="text-muted-foreground">
                    Cliquez sur un rendez-vous dans le calendrier pour voir ses détails
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card className="mt-8">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span>En attente</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span>Confirmé</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span>Terminé</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span>Annulé</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminCalendarPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <CalendarContent />
    </Suspense>
  )
}
