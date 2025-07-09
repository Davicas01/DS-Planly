"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Heart, Moon, Droplets, Zap, TrendingUp, Plus, Activity } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface HealthRecord {
  date: string
  mood: number
  sleep: number
  water: number
  energy: number
  weight?: number
}

interface SleepRecord {
  bedtime: string
  wakeup: string
  quality: number
  notes: string
}

export default function HealthPage() {
  const [todayRecord, setTodayRecord] = useState<HealthRecord>({
    date: new Date().toISOString().split("T")[0],
    mood: 8,
    sleep: 7.5,
    water: 5,
    energy: 7,
  })

  const [showNewRecordDialog, setShowNewRecordDialog] = useState(false)
  const [showSleepDialog, setShowSleepDialog] = useState(false)
  const [sleepRecord, setSleepRecord] = useState<SleepRecord>({
    bedtime: "23:00",
    wakeup: "07:00",
    quality: 8,
    notes: ""
  })

  const [weekData] = useState([
    { day: "Seg", mood: 7, sleep: 8, energy: 6 },
    { day: "Ter", mood: 8, sleep: 7, energy: 8 },
    { day: "Qua", mood: 6, sleep: 6, energy: 5 },
    { day: "Qui", mood: 9, sleep: 8, energy: 9 },
    { day: "Sex", mood: 8, sleep: 7, energy: 7 },
    { day: "Sáb", mood: 9, sleep: 9, energy: 8 },
    { day: "Dom", mood: 8, sleep: 8, energy: 7 },
  ])

  const { toast } = useToast()

  const getMoodEmoji = (mood: number) => {
    if (mood >= 9) return "😄"
    if (mood >= 7) return "😊"
    if (mood >= 5) return "😐"
    if (mood >= 3) return "😔"
    return "😢"
  }

  const getEnergyColor = (energy: number) => {
    if (energy >= 8) return "bg-green-500"
    if (energy >= 6) return "bg-yellow-500"
    if (energy >= 4) return "bg-orange-500"
    return "bg-red-500"
  }

  const handleAddWater = () => {
    if (todayRecord.water < 8) {
      setTodayRecord(prev => ({
        ...prev,
        water: prev.water + 1
      }))
      
      toast({
        title: "Hidratação registrada!",
        description: `Você bebeu ${todayRecord.water + 1} copos de água hoje.`,
      })
    } else {
      toast({
        title: "Meta atingida!",
        description: "Você já bebeu 8 copos de água hoje. Parabéns!",
      })
    }
  }

  const handleSaveNewRecord = () => {
    // Aqui você salvaria no backend
    toast({
      title: "Registro salvo!",
      description: "Seus dados de saúde foram registrados com sucesso.",
    })
    setShowNewRecordDialog(false)
  }

  const handleSaveSleep = () => {
    // Calcular horas de sono
    const bedtime = new Date(`2024-01-01 ${sleepRecord.bedtime}`)
    const wakeup = new Date(`2024-01-01 ${sleepRecord.wakeup}`)
    
    // Se acordou antes de dormir, adicionar um dia
    if (wakeup < bedtime) {
      wakeup.setDate(wakeup.getDate() + 1)
    }
    
    const sleepHours = (wakeup.getTime() - bedtime.getTime()) / (1000 * 60 * 60)
    
    setTodayRecord(prev => ({
      ...prev,
      sleep: sleepHours
    }))
    
    toast({
      title: "Sono registrado!",
      description: `Você dormiu ${sleepHours.toFixed(1)} horas com qualidade ${sleepRecord.quality}/10.`,
    })
    
    setShowSleepDialog(false)
  }

  const updateTodayRecord = (field: keyof HealthRecord, value: any) => {
    setTodayRecord(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Salvar automaticamente quando houver mudanças
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      // Aqui você salvaria no backend
      console.log('Salvando dados:', todayRecord)
    }, 1000)

    return () => clearTimeout(saveTimer)
  }, [todayRecord])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saúde & Bem-estar</h1>
          <p className="text-gray-600">Monitore seu bem-estar diário</p>
        </div>
        <Dialog open={showNewRecordDialog} onOpenChange={setShowNewRecordDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Novo Registro
            </Button>
          </DialogTrigger>
          <NewRecordDialog onSave={handleSaveNewRecord} />
        </Dialog>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humor</CardTitle>
            <Heart className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="text-4xl">{getMoodEmoji(todayRecord.mood)}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{todayRecord.mood}/10</div>
              <p className="text-sm text-muted-foreground">Muito bem hoje!</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sono</CardTitle>
            <Moon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold">{todayRecord.sleep}h</div>
              <p className="text-sm text-muted-foreground mb-4">Ontem à noite</p>
              <Badge className="bg-green-100 text-green-700">Boa qualidade</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hidratação</CardTitle>
            <Droplets className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-2xl font-bold">{todayRecord.water}/8</div>
              <p className="text-sm text-muted-foreground">copos de água</p>
            </div>
            <div className="flex justify-center space-x-1">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-6 rounded-full ${i < todayRecord.water ? "bg-cyan-500" : "bg-gray-200"}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energia</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-2xl font-bold">{todayRecord.energy}/10</div>
              <p className="text-sm text-muted-foreground">Nível atual</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${getEnergyColor(todayRecord.energy)}`}
                style={{ width: `${(todayRecord.energy / 10) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Input */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Hoje</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Como você está se sentindo?</label>
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{getMoodEmoji(todayRecord.mood)}</span>
              <Slider
                value={[todayRecord.mood]}
                onValueChange={(value) => updateTodayRecord('mood', value[0])}
                max={10}
                min={1}
                step={1}
                className="flex-1"
              />
              <span className="font-semibold w-8">{todayRecord.mood}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Nível de energia</label>
            <div className="flex items-center space-x-4">
              <Zap className="h-5 w-5 text-yellow-500" />
              <Slider
                value={[todayRecord.energy]}
                onValueChange={(value) => updateTodayRecord('energy', value[0])}
                max={10}
                min={1}
                step={1}
                className="flex-1"
              />
              <span className="font-semibold w-8">{todayRecord.energy}</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={handleAddWater}
              disabled={todayRecord.water >= 8}
            >
              <Droplets className="h-4 w-4 mr-2" />
              +1 Copo de Água
            </Button>
            <Dialog open={showSleepDialog} onOpenChange={setShowSleepDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Moon className="h-4 w-4 mr-2" />
                  Registrar Sono
                </Button>
              </DialogTrigger>
              <SleepDialog 
                sleepRecord={sleepRecord}
                setSleepRecord={setSleepRecord}
                onSave={handleSaveSleep}
              />
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Tendências da Semana</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {weekData.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-sm text-gray-500 mb-2">{day.day}</div>
                <div className="space-y-2">
                  <div className="text-lg">{getMoodEmoji(day.mood)}</div>
                  <div className="text-xs text-gray-600">Humor: {day.mood}</div>
                  <div className="text-xs text-gray-600">Sono: {day.sleep}h</div>
                  <div className="text-xs text-gray-600">Energia: {day.energy}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Insights da Semana</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">💤 Padrão de Sono</h3>
              <p className="text-sm text-blue-700">
                Você dorme melhor nos fins de semana (8.5h média) vs dias úteis (7.2h média).
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">😊 Humor Estável</h3>
              <p className="text-sm text-green-700">
                Seu humor tem se mantido consistentemente alto esta semana (média 7.8/10).
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">⚡ Energia & Exercícios</h3>
              <p className="text-sm text-yellow-700">
                Dias com exercício mostram 23% mais energia que dias sedentários.
              </p>
            </div>
            <div className="bg-cyan-50 p-4 rounded-lg">
              <h3 className="font-semibold text-cyan-900 mb-2">💧 Meta de Hidratação</h3>
              <p className="text-sm text-cyan-700">
                Você atingiu a meta de hidratação em 5 dos 7 dias. Continue assim!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para o diálogo de novo registro
function NewRecordDialog({ onSave }: { onSave: () => void }) {
  const [formData, setFormData] = useState({
    weight: '',
    bloodPressure: '',
    symptoms: '',
    notes: ''
  })

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Novo Registro de Saúde</DialogTitle>
        <DialogDescription>
          Adicione informações sobre sua saúde hoje.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="weight" className="text-right">
            Peso (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            placeholder="70.5"
            className="col-span-3"
            value={formData.weight}
            onChange={(e) => setFormData({...formData, weight: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="bloodPressure" className="text-right">
            Pressão
          </Label>
          <Input
            id="bloodPressure"
            placeholder="120/80"
            className="col-span-3"
            value={formData.bloodPressure}
            onChange={(e) => setFormData({...formData, bloodPressure: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="symptoms" className="text-right">
            Sintomas
          </Label>
          <Input
            id="symptoms"
            placeholder="Dor de cabeça, cansaço..."
            className="col-span-3"
            value={formData.symptoms}
            onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="notes" className="text-right">
            Observações
          </Label>
          <Textarea
            id="notes"
            placeholder="Observações adicionais..."
            className="col-span-3"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" onClick={onSave}>Salvar Registro</Button>
      </DialogFooter>
    </DialogContent>
  )
}

// Componente para o diálogo de sono
function SleepDialog({ 
  sleepRecord, 
  setSleepRecord, 
  onSave 
}: { 
  sleepRecord: SleepRecord
  setSleepRecord: (record: SleepRecord) => void
  onSave: () => void 
}) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Registrar Sono</DialogTitle>
        <DialogDescription>
          Registre seus horários de sono e qualidade do descanso.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="bedtime" className="text-right">
            Hora de dormir
          </Label>
          <Input
            id="bedtime"
            type="time"
            className="col-span-3"
            value={sleepRecord.bedtime}
            onChange={(e) => setSleepRecord({...sleepRecord, bedtime: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="wakeup" className="text-right">
            Hora de acordar
          </Label>
          <Input
            id="wakeup"
            type="time"
            className="col-span-3"
            value={sleepRecord.wakeup}
            onChange={(e) => setSleepRecord({...sleepRecord, wakeup: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">
            Qualidade (1-10)
          </Label>
          <div className="col-span-3 flex items-center space-x-2">
            <Slider
              value={[sleepRecord.quality]}
              onValueChange={(value) => setSleepRecord({...sleepRecord, quality: value[0]})}
              max={10}
              min={1}
              step={1}
              className="flex-1"
            />
            <span className="font-semibold w-8">{sleepRecord.quality}</span>
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="sleepNotes" className="text-right">
            Observações
          </Label>
          <Textarea
            id="sleepNotes"
            placeholder="Como foi seu sono..."
            className="col-span-3"
            value={sleepRecord.notes}
            onChange={(e) => setSleepRecord({...sleepRecord, notes: e.target.value})}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" onClick={onSave}>Salvar Sono</Button>
      </DialogFooter>
    </DialogContent>
  )
}
