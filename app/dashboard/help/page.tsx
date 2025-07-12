"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Mail, 
  Phone,
  Book,
  Video,
  FileText,
  ChevronRight,
  Star,
  Clock,
  CheckCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const { toast } = useToast()

  const faqItems = [
    {
      question: "Como criar um novo hábito?",
      answer: "Para criar um novo hábito, vá até a seção 'Hábitos' no menu lateral, clique em 'Adicionar Hábito' e preencha as informações como nome, descrição, frequência e horário desejado."
    },
    {
      question: "Como acompanhar minhas finanças?",
      answer: "Na seção 'Finanças', você pode adicionar receitas e despesas, definir metas de economia e acompanhar seu progresso através de gráficos e relatórios detalhados."
    },
    {
      question: "O que é o Chat IA e como usar?",
      answer: "O Chat IA é seu assistente pessoal que pode ajudar com dicas de produtividade, sugestões de hábitos, análise de progresso e muito mais. Basta fazer uma pergunta e ele te ajudará!"
    },
    {
      question: "Como funciona o sistema de streak?",
      answer: "O streak conta quantos dias consecutivos você mantém seus hábitos. Cada dia que você completa suas tarefas, seu streak aumenta. Se você perder um dia, o contador reinicia."
    },
    {
      question: "Posso usar o Planly offline?",
      answer: "Sim! O Planly funciona offline para a maioria das funcionalidades. Seus dados serão sincronizados automaticamente quando você voltar a ter conexão com a internet."
    },
    {
      question: "Como alterar minha senha?",
      answer: "Vá em 'Configurações' > 'Segurança' e clique em 'Alterar Senha'. Você precisará inserir sua senha atual e a nova senha duas vezes para confirmar."
    },
    {
      question: "Como exportar meus dados?",
      answer: "Em 'Configurações' > 'Dados', você encontra a opção 'Exportar Dados' que permite baixar todas suas informações em formato CSV ou PDF."
    },
    {
      question: "O Planly tem versão mobile?",
      answer: "Sim! O Planly é um PWA (Progressive Web App), o que significa que você pode instalá-lo em seu celular como um app nativo através do navegador."
    }
  ]

  const quickActions = [
    {
      title: "Guia de Início Rápido",
      description: "Aprenda o básico em 5 minutos",
      icon: Book,
      badge: "Recomendado",
      badgeColor: "bg-green-100 text-green-700"
    },
    {
      title: "Vídeo Tutoriais",
      description: "Assista aos nossos tutoriais",
      icon: Video,
      badge: "Novo",
      badgeColor: "bg-blue-100 text-blue-700"
    },
    {
      title: "Documentação",
      description: "Guia completo de funcionalidades",
      icon: FileText,
      badge: null,
      badgeColor: ""
    }
  ]

  const contactOptions = [
    {
      title: "Chat ao Vivo",
      description: "Resposta em até 5 minutos",
      icon: MessageCircle,
      available: true,
      action: () => toast({ title: "Chat iniciado!", description: "Um agente entrará em contato em breve." })
    },
    {
      title: "Email",
      description: "suporte@planly.app",
      icon: Mail,
      available: true,
      action: () => window.open("mailto:suporte@planly.app")
    },
    {
      title: "Telefone",
      description: "+55 (11) 9999-9999",
      icon: Phone,
      available: false,
      action: () => {}
    }
  ]

  const filteredFAQ = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você enviaria o formulário para o backend
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em até 24 horas.",
    })
    setContactForm({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <HelpCircle className="h-6 w-6" />
          <span>Central de Ajuda</span>
        </h1>
        <p className="text-gray-600">Encontre respostas, tutoriais e entre em contato conosco</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar na central de ajuda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <action.icon className="h-6 w-6 text-blue-600" />
                      {action.badge && (
                        <Badge className={action.badgeColor}>
                          {action.badge}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                    <ChevronRight className="h-4 w-4 text-gray-400 mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
              <p className="text-sm text-gray-600">
                {searchQuery ? `${filteredFAQ.length} resultado(s) encontrado(s)` : `${faqItems.length} perguntas disponíveis`}
              </p>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQ.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              {filteredFAQ.length === 0 && searchQuery && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum resultado encontrado para "{searchQuery}"</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Limpar pesquisa
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Formulário de Contato */}
          <Card>
            <CardHeader>
              <CardTitle>Não encontrou o que procura?</CardTitle>
              <p className="text-sm text-gray-600">Envie sua dúvida e nossa equipe responderá em breve</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assunto
                  </label>
                  <Input
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem
                  </label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" className="w-full md:w-auto">
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Opções de Contato */}
          <Card>
            <CardHeader>
              <CardTitle>Fale Conosco</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {contactOptions.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg transition-colors ${
                    option.available 
                      ? 'hover:bg-gray-50 cursor-pointer' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={option.available ? option.action : undefined}
                >
                  <div className="flex items-center space-x-3">
                    <option.icon className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{option.title}</h4>
                        {option.available ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Status do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle>Status do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Aplicação</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Operacional</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Operacional</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Banco de Dados</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Operacional</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avaliação */}
          <Card>
            <CardHeader>
              <CardTitle>Avalie nossa Ajuda</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Esta página foi útil para você?
              </p>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-6 w-6 text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}