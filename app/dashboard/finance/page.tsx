"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, DollarSign, TrendingUp, Filter, Calendar, PieChart, ArrowUpRight, ArrowDownRight, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
  icon: string
}

interface NewTransaction {
  type: "income" | "expense"
  amount: string
  category: string
  description: string
  date: string
}

export default function FinancePage() {
  const [showNewTransactionDialog, setShowNewTransactionDialog] = useState(false)
  const [dateFilter, setDateFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [searchFilter, setSearchFilter] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "expense",
      amount: 45.9,
      category: "Alimentação",
      description: "Almoço no restaurante",
      date: "2024-01-09",
      icon: "🍽️",
    },
    {
      id: "2",
      type: "income",
      amount: 4200.0,
      category: "Salário",
      description: "Salário Janeiro",
      date: "2024-01-05",
      icon: "💰",
    },
    {
      id: "3",
      type: "expense",
      amount: 89.99,
      category: "Transporte",
      description: "Combustível",
      date: "2024-01-08",
      icon: "⛽",
    },
    {
      id: "4",
      type: "expense",
      amount: 129.9,
      category: "Saúde",
      description: "Consulta médica",
      date: "2024-01-07",
      icon: "🏥",
    },
  ])

  const [newTransaction, setNewTransaction] = useState<NewTransaction>({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  })

  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions)

  const { toast } = useToast()

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  const categories = [
    { name: "Alimentação", amount: 450.8, color: "bg-red-500", percentage: 35 },
    { name: "Transporte", amount: 320.5, color: "bg-blue-500", percentage: 25 },
    { name: "Saúde", amount: 280.9, color: "bg-green-500", percentage: 22 },
    { name: "Lazer", amount: 180.3, color: "bg-purple-500", percentage: 14 },
    { name: "Outros", amount: 120.0, color: "bg-gray-500", percentage: 4 },
  ]

  const expenseCategories = [
    "Alimentação",
    "Transporte", 
    "Saúde",
    "Lazer",
    "Moradia",
    "Educação",
    "Compras",
    "Outros"
  ]

  const incomeCategories = [
    "Salário",
    "Freelance",
    "Investimentos",
    "Vendas",
    "Outros"
  ]

  const dateFilterOptions = [
    { value: "all", label: "Todos os períodos" },
    { value: "today", label: "Hoje" },
    { value: "week", label: "Esta semana" },
    { value: "month", label: "Este mês" },
    { value: "last30", label: "Últimos 30 dias" }
  ]

  // Filtrar transações
  useEffect(() => {
    let filtered = transactions

    // Filtro por data
    if (dateFilter !== "all") {
      const today = new Date()
      const filterDate = new Date()
      
      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter(t => new Date(t.date) >= filterDate)
          break
        case "week":
          filterDate.setDate(today.getDate() - 7)
          filtered = filtered.filter(t => new Date(t.date) >= filterDate)
          break
        case "month":
          filterDate.setMonth(today.getMonth() - 1)
          filtered = filtered.filter(t => new Date(t.date) >= filterDate)
          break
        case "last30":
          filterDate.setDate(today.getDate() - 30)
          filtered = filtered.filter(t => new Date(t.date) >= filterDate)
          break
      }
    }

    // Filtro por categoria
    if (categoryFilter !== "all") {
      filtered = filtered.filter(t => t.category === categoryFilter)
    }

    // Filtro por busca
    if (searchFilter) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
        t.category.toLowerCase().includes(searchFilter.toLowerCase())
      )
    }

    setFilteredTransactions(filtered)
  }, [transactions, dateFilter, categoryFilter, searchFilter])

  const handleSaveTransaction = () => {
    if (!newTransaction.amount || !newTransaction.category || !newTransaction.description) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      })
      return
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      description: newTransaction.description,
      date: newTransaction.date,
      icon: newTransaction.type === "income" ? "💰" : "💳"
    }

    setTransactions(prev => [transaction, ...prev])
    
    toast({
      title: "Transação adicionada!",
      description: `${newTransaction.type === "income" ? "Receita" : "Despesa"} de R$ ${newTransaction.amount} registrada.`,
    })

    setNewTransaction({ type: "expense", amount: "", category: "", description: "", date: new Date().toISOString().split('T')[0] })
    setShowNewTransactionDialog(false)
  }

  const clearFilters = () => {
    setDateFilter("all")
    setCategoryFilter("all")
    setSearchFilter("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finanças</h1>
          <p className="text-gray-600">Controle total do seu dinheiro</p>
        </div>
        <Dialog open={showNewTransactionDialog} onOpenChange={setShowNewTransactionDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <NewTransactionDialog transaction={newTransaction} setTransaction={setNewTransaction} onSave={handleSaveTransaction} />
        </Dialog>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12% este mês
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5" />
            <span>Gastos por Categoria</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${category.color}`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-sm w-20 text-right">
                    R$ {category.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm text-gray-500 w-8">{category.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transações Recentes</CardTitle>
          <div className="flex space-x-2 items-center">
            {/* Busca */}
            <Input
              placeholder="Buscar transações..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-48"
            />
            
            {/* Filtro por período */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Período
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {dateFilterOptions.map((option) => (
                  <DropdownMenuItem key={option.value} onClick={() => setDateFilter(option.value)}>
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filtro por categoria */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Categoria
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                  Todas as categorias
                </DropdownMenuItem>
                {[...expenseCategories, ...incomeCategories].map((category) => (
                  <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Limpar filtros */}
            {(dateFilter !== "all" || categoryFilter !== "all" || searchFilter) && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma transação encontrada com os filtros aplicados.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{transaction.icon}</div>
                    <div>
                      <h3 className="font-medium">{transaction.description}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "income" ? "+" : "-"}R${" "}
                    {transaction.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para o diálogo de nova transação
function NewTransactionDialog({ 
  transaction, 
  setTransaction, 
  onSave 
}: { 
  transaction: NewTransaction
  setTransaction: (transaction: NewTransaction) => void
  onSave: () => void 
}) {
  const expenseCategories = [
    "Alimentação",
    "Transporte", 
    "Saúde",
    "Lazer",
    "Moradia",
    "Educação",
    "Compras",
    "Outros"
  ]

  const incomeCategories = [
    "Salário",
    "Freelance",
    "Investimentos",
    "Vendas",
    "Outros"
  ]

  const categories = transaction.type === "income" ? incomeCategories : expenseCategories

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Nova Transação</DialogTitle>
        <DialogDescription>
          Adicione uma nova receita ou despesa.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Tipo</Label>
          <Select 
            value={transaction.type} 
            onValueChange={(value: "income" | "expense") => setTransaction({...transaction, type: value, category: ""})}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Despesa</SelectItem>
              <SelectItem value="income">Receita</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="amount" className="text-right">
            Valor (R$)
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0,00"
            className="col-span-3"
            value={transaction.amount}
            onChange={(e) => setTransaction({...transaction, amount: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Categoria</Label>
          <Select 
            value={transaction.category} 
            onValueChange={(value) => setTransaction({...transaction, category: value})}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Descrição
          </Label>
          <Input
            id="description"
            placeholder="Descrição da transação"
            className="col-span-3"
            value={transaction.description}
            onChange={(e) => setTransaction({...transaction, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="date" className="text-right">
            Data
          </Label>
          <Input
            id="date"
            type="date"
            className="col-span-3"
            value={transaction.date}
            onChange={(e) => setTransaction({...transaction, date: e.target.value})}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" onClick={onSave}>Salvar Transação</Button>
      </DialogFooter>
    </DialogContent>
  )
}