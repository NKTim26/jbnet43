"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { FileText, Plus, Download, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Invoice {
  id: string
  invoice_number: string
  user_id: string
  amount: number
  status: string
  due_date: string | null
  created_at: string
  description: string | null
}

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
}

export default function AdminInvoicesPage() {
  const supabase = createClient()
  
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  // Create form state
  const [selectedClient, setSelectedClient] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    
    const [invoicesRes, clientsRes] = await Promise.all([
      supabase.from("invoices").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").eq("role", "client"),
    ])

    setInvoices(invoicesRes.data || [])
    setClients(clientsRes.data || [])
    setLoading(false)
  }

  const createInvoice = async () => {
    if (!selectedClient || !amount) return
    
    setCreating(true)
    
    const invoiceNumber = `FAC-${Date.now().toString().slice(-8)}`
    
    await supabase.from("invoices").insert({
      invoice_number: invoiceNumber,
      user_id: selectedClient,
      amount: parseFloat(amount),
      status: "pending",
      due_date: dueDate || null,
      description: description || null,
    })

    setShowCreateForm(false)
    setSelectedClient("")
    setAmount("")
    setDescription("")
    setDueDate("")
    setCreating(false)
    fetchData()
  }

  const updateInvoiceStatus = async (id: string, status: string) => {
    await supabase.from("invoices").update({ status }).eq("id", id)
    fetchData()
  }

  const getClientName = (userId: string) => {
    const client = clients.find(c => c.id === userId)
    return client ? `${client.first_name || ""} ${client.last_name || ""}`.trim() || client.email : "Client inconnu"
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800",
    }
    const labels: Record<string, string> = {
      pending: "En attente",
      paid: "Payée",
      overdue: "En retard",
    }
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
        {labels[status] || status}
      </span>
    )
  }

  const pendingTotal = invoices.filter(i => i.status === "pending").reduce((sum, i) => sum + i.amount, 0)
  const paidTotal = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0)
  const overdueTotal = invoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            Factures
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gérez la facturation de vos clients
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle facture
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En attente
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingTotal.toFixed(2)} €</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Payées
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidTotal.toFixed(2)} €</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En retard
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTotal.toFixed(2)} €</div>
          </CardContent>
        </Card>
      </div>

      {/* Create Invoice Form */}
      {showCreateForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nouvelle facture</CardTitle>
            <CardDescription>Créez une facture pour un client</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="client">Client</FieldLabel>
                  <select
                    id="client"
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.first_name} {client.last_name} - {client.email}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="amount">Montant (€)</FieldLabel>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description de la prestation"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="dueDate">Date d'échéance</FieldLabel>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </Field>
            </FieldGroup>
            <div className="mt-6 flex gap-2">
              <Button onClick={createInvoice} disabled={creating || !selectedClient || !amount}>
                {creating ? "Création..." : "Créer la facture"}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoices List */}
      {invoices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">Aucune facture pour le moment</p>
            <Button onClick={() => setShowCreateForm(true)} className="mt-4">
              Créer une facture
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Historique des factures</CardTitle>
            <CardDescription>{invoices.length} factures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">N° Facture</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Client</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Échéance</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Montant</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Statut</th>
                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-secondary/30">
                      <td className="py-4 font-medium text-foreground">
                        #{invoice.invoice_number}
                      </td>
                      <td className="py-4 text-sm">
                        {getClientName(invoice.user_id)}
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">
                        {new Date(invoice.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">
                        {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString("fr-FR") : "-"}
                      </td>
                      <td className="py-4 font-semibold text-foreground">
                        {invoice.amount.toFixed(2)} €
                      </td>
                      <td className="py-4">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-end gap-2">
                          {invoice.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateInvoiceStatus(invoice.id, "paid")}
                            >
                              Marquer payée
                            </Button>
                          )}
                          {invoice.status === "paid" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateInvoiceStatus(invoice.id, "pending")}
                            >
                              Non payée
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
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
