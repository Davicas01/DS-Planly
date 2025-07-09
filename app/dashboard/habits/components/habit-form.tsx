"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { X, Plus, Target, Heart, Brain, Zap, Book, Dumbbell } from "lucide-react"
import { cn } from "@/lib/utils"

interface HabitFormProps {
  onClose: () => void
  onSave: (habit: any) => void
  editingHabit?: any
}

export function HabitForm({ onClose, onSave, editingHabit }: HabitFormProps) {
  const [formData, setFormData] = useState({
    id: editingHabit?.id || '',
    name: "",
    category: "",
    frequency: "daily",
    target: 1,
    unit: "times",
    reminder: true,
    reminderTime: "09:00",
    color: "#3b82f6",
    notes: "",
  })

  // Preencher dados se estiver editando
  useEffect(() => {
    if (editingHabit) {
      setFormData({
        id: editingHabit.id,
        name: editingHabit.name || "",
        category: editingHabit.category || "",
        frequency: "daily",
        target: editingHabit.target || 1,
        unit: "times",
        reminder: true,
        reminderTime: "09:00",
        color: editingHabit.color || "#3b82f6",
        notes: "",
      })
    }
  }, [editingHabit])

  const categories = [
    { id: "health", name: "Saúde", icon: Heart, color: "#10b981" },
    { id: "productivity", name: "Produtividade", icon: Target, color: "#3b82f6" },
    { id: "learning", name: "Aprendizado", icon: Book, color: "#8b5cf6" },
    { id: "fitness", name: "Exercícios", icon: Dumbbell, color: "#f59e0b" },
    { id: "mindfulness", name: "Bem-estar", icon: Brain, color: "#ec4899" },
    { id: "energy", name: "Energia", icon: Zap, color: "#eab308" },
  ]

  const frequencies = [
    { value: "daily", label: "Diariamente" },
    { value: "weekly", label: "Semanalmente" },
    { value: "custom", label: "Personalizado" },
  ]

  const units = [
    { value: "times", label: "vezes" },
    { value: "minutes", label: "minutos" },
    { value: "hours", label: "horas" },
    { value: "pages", label: "páginas" },
    { value: "glasses", label: "copos" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const selectedCategory = categories.find((cat) => cat.id === formData.category)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>{editingHabit ? 'Editar Hábito' : 'Novo Hábito'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome do Hábito */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Hábito</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Exercitar-se, Ler, Meditar..."
                required
              />
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label>Categoria</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    type="button"
                    variant={formData.category === category.id ? "default" : "outline"}
                    className={cn(
                      "flex items-center space-x-2 justify-start h-auto p-3",
                      formData.category === category.id && "bg-blue-500 text-white",
                    )}
                    onClick={() => setFormData({ ...formData, category: category.id, color: category.color })}
                  >
                    <category.icon className="h-4 w-4" />
                    <span className="text-sm">{category.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Frequência */}
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequência</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => setFormData({ ...formData, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target">Meta</Label>
                <Input
                  id="target"
                  type="number"
                  min="1"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unidade</Label>
                <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Lembrete */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="reminder">Ativar lembrete</Label>
                <Switch
                  id="reminder"
                  checked={formData.reminder}
                  onCheckedChange={(checked) => setFormData({ ...formData, reminder: checked })}
                />
              </div>

              {formData.reminder && (
                <div className="space-y-2">
                  <Label htmlFor="reminderTime">Horário do lembrete</Label>
                  <Input
                    id="reminderTime"
                    type="time"
                    value={formData.reminderTime}
                    onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                  />
                </div>
              )}
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Adicione detalhes sobre seu hábito..."
                rows={3}
              />
            </div>

            {/* Preview */}
            {formData.name && selectedCategory && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Preview:</h3>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: formData.color }}
                  >
                    <selectedCategory.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{formData.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Badge variant="secondary">{selectedCategory.name}</Badge>
                      <span>
                        Meta: {formData.target} {formData.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                {editingHabit ? 'Salvar Alterações' : 'Criar Hábito'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}