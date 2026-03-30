import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye } from "lucide-react"

export default async function InvoicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

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

  const pendingTotal = invoices?.filter(i => i.status === "pending").reduce((sum, i) => sum + i.amount, 0) || 0
  const paidTotal = invoices?.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0) || 0

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          Mes factures
        </h1>
        <p className="mt-1 text-muted-foreground">
          Consultez et téléchargez vos factures
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total factures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En attente de paiement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingTotal.toFixed(2)} €</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total payé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidTotal.toFixed(2)} €</div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      {!invoices || invoices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">Aucune facture pour le moment</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Vos factures apparaîtront ici après vos premières interventions
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Historique des factures</CardTitle>
            <CardDescription>Toutes vos factures classées par date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">N° Facture</th>
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
                      <td className="py-4 text-muted-foreground">
                        {new Date(invoice.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-4 text-muted-foreground">
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
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">Voir</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">PDF</span>
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
