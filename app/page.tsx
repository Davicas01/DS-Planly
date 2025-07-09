import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  DollarSign,
  Heart,
  Brain,
  TrendingUp,
  Zap,
  Check,
  Star,
  ChevronDown,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react"
import Link from "next/link"

export default function PlanlyLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl text-slate-900">Planly</span>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">Começar Grátis</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">🚀 Agora em Beta Aberto</Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
                  Sua vida,{" "}
                  <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                    organizada
                  </span>{" "}
                  e inteligente
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Pare de usar 10 apps diferentes. O Planly centraliza hábitos, finanças, saúde e bem-estar com IA que
                  realmente entende você.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg">
                  Começar Grátis
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg bg-transparent">
                  Ver Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-slate-500">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Grátis para começar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Sem cartão de crédito</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between text-white mb-2">
                    <span className="font-semibold">Dashboard</span>
                    <span className="text-sm opacity-80">Hoje</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="text-2xl font-bold">7</div>
                      <div className="text-sm opacity-80">Hábitos</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="text-2xl font-bold">R$ 2.4k</div>
                      <div className="text-sm opacity-80">Saldo</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Exercício</span>
                    </div>
                    <span className="text-sm text-slate-500">5 dias</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">Leitura</span>
                    </div>
                    <span className="text-sm text-slate-500">3 dias</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-2xl transform -rotate-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Problema/Solução */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Chega de apps espalhados</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Pessoas usam em média <span className="font-bold text-blue-500">8 apps diferentes</span> para organizar a
              vida. É hora de unificar tudo em um só lugar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Antes: Caos Digital</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "App de Hábitos",
                  "App de Finanças",
                  "App de Saúde",
                  "App de Notas",
                  "App de Tarefas",
                  "App de Humor",
                  "App de Sono",
                  "App de Exercícios",
                ].map((app, index) => (
                  <div
                    key={index}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg text-center text-sm text-red-700"
                  >
                    {app}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Depois: Unificação Inteligente</h3>
              <div className="p-8 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">P</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Planly</h4>
                  <p className="text-slate-600">Tudo em um só lugar com IA que conecta os pontos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Principais */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Recursos que fazem a diferença</h2>
            <p className="text-xl text-slate-600">Cada funcionalidade foi pensada para trabalhar em conjunto</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                  <Target className="h-6 w-6 text-blue-500 group-hover:text-white" />
                </div>
                <CardTitle className="text-xl">Hábitos Inteligentes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Tracking visual + streaks + IA que identifica padrões e sugere melhorias
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                  <DollarSign className="h-6 w-6 text-green-500 group-hover:text-white" />
                </div>
                <CardTitle className="text-xl">Finanças Centralizadas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Lançamentos rápidos + categorização automática por IA + insights de gastos
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-500 transition-colors">
                  <Heart className="h-6 w-6 text-red-500 group-hover:text-white" />
                </div>
                <CardTitle className="text-xl">Saúde Holística</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Humor, sono, energia + correlações automáticas entre saúde e hábitos
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-500 transition-colors">
                  <Brain className="h-6 w-6 text-yellow-500 group-hover:text-white" />
                </div>
                <CardTitle className="text-xl">IA Contextual</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Insights cruzados entre todas as áreas da sua vida com recomendações personalizadas
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Dashboard que conecta tudo</h2>
            <p className="text-xl text-slate-600">Veja como todas as áreas da sua vida se relacionam</p>
          </div>

          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Resumo Diário</h3>
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm opacity-80">Hábitos</span>
                    <span className="font-mono">7/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm opacity-80">Gastos</span>
                    <span className="font-mono">R$ 89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm opacity-80">Humor</span>
                    <span className="font-mono">😊 8/10</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Saldo Atual</h3>
                  <DollarSign className="h-5 w-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold font-mono mb-2">R$ 2.847</div>
                <div className="text-sm text-green-400">+12% este mês</div>
              </div>

              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Streak Record</h3>
                  <Target className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold font-mono mb-2">23</div>
                <div className="text-sm opacity-80">dias consecutivos</div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg mb-4">
                <span className="text-yellow-400">💡 Insight da IA:</span> Seus gastos com saúde aumentaram 15% quando
                você mantém exercícios regulares
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Comece grátis, evolua quando quiser</h2>
            <p className="text-xl text-slate-600">Sem pegadinhas, sem compromissos longos</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-slate-200 bg-white">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Gratuito</CardTitle>
                <div className="text-4xl font-bold text-slate-900 mt-4">R$ 0</div>
                <CardDescription className="text-base">Para começar sua jornada</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    "3 hábitos ativos",
                    "30 dias de histórico",
                    "10 perguntas IA por dia",
                    "Dashboard básico",
                    "Sync entre dispositivos",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-8 bg-transparent" variant="outline">
                  Começar Grátis
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 bg-white relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">Mais Popular</Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Premium</CardTitle>
                <div className="text-4xl font-bold text-slate-900 mt-4">
                  R$ 19<span className="text-lg text-slate-500">,90/mês</span>
                </div>
                <CardDescription className="text-base">Para quem quer o máximo controle</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    "Hábitos ilimitados",
                    "Histórico completo",
                    "IA ilimitada + insights avançados",
                    "Relatórios detalhados",
                    "Metas personalizadas",
                    "Suporte prioritário",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-8 bg-blue-500 hover:bg-blue-600">Começar Grátis</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Já estamos mudando vidas</h2>
            <div className="flex items-center justify-center space-x-8 text-2xl font-bold text-slate-900">
              <div className="text-center">
                <div className="text-blue-500">87%</div>
                <div className="text-sm text-slate-600 font-normal">reduziram outros apps</div>
              </div>
              <div className="text-center">
                <div className="text-green-500">2.3x</div>
                <div className="text-sm text-slate-600 font-normal">mais hábitos mantidos</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-500">4.8★</div>
                <div className="text-sm text-slate-600 font-normal">avaliação média</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ana Silva",
                role: "Designer",
                content:
                  "Finalmente consegui manter meus hábitos! A IA do Planly me ajuda a entender como meu humor afeta minha produtividade.",
                rating: 5,
              },
              {
                name: "Carlos Santos",
                role: "Desenvolvedor",
                content:
                  "Deletei 6 apps depois do Planly. Ter tudo integrado com insights inteligentes mudou completamente minha rotina.",
                rating: 5,
              },
              {
                name: "Maria Costa",
                role: "Gerente de Marketing",
                content:
                  "Os insights cruzados são incríveis! Descobri que gasto mais quando não durmo bem. Isso me ajudou a economizar R$ 800/mês.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 bg-slate-50">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Perguntas frequentes</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Como a IA funciona?",
                answer:
                  "Nossa IA analisa padrões entre seus hábitos, gastos, humor e saúde para oferecer insights personalizados. Por exemplo, ela pode identificar que você gasta mais quando está estressado ou que exercícios melhoram seu humor.",
              },
              {
                question: "Meus dados são seguros?",
                answer:
                  "Sim! Usamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança. Seus dados ficam apenas no seu dispositivo e em nossos servidores seguros. Nunca vendemos informações pessoais.",
              },
              {
                question: "Funciona offline?",
                answer:
                  "Como PWA, o Planly funciona offline para funções básicas como adicionar hábitos e lançamentos. Os insights da IA precisam de conexão, mas são sincronizados quando você volta online.",
              },
              {
                question: "Posso importar dados de outros apps?",
                answer:
                  "Estamos trabalhando em integrações com os principais apps de hábitos e finanças. Por enquanto, você pode importar dados via CSV ou adicionar manualmente - é mais rápido do que parece!",
              },
            ].map((faq, index) => (
              <Card key={index} className="border-0 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">{faq.question}</h3>
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  </div>
                  <p className="text-slate-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-500 to-green-500">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para organizar sua vida?</h2>
          <p className="text-xl mb-8 opacity-90">Junte-se a milhares de pessoas que já simplificaram suas rotinas</p>
          <Button size="lg" className="bg-white text-blue-500 hover:bg-slate-100 px-8 py-4 text-lg">
            Começar Grátis Agora
            <Zap className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm mt-4 opacity-80">Sem cartão de crédito • Cancele quando quiser</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="font-bold text-xl">Planly</span>
              </div>
              <p className="text-slate-400 mb-4">Sua vida, organizada e inteligente</p>
              <div className="flex space-x-4">
                <Link href="#" className="text-slate-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-slate-400 hover:text-white">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-slate-400 hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-slate-400 hover:text-white">
                  <Mail className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <div className="space-y-2 text-slate-400">
                <Link href="#" className="block hover:text-white">
                  Recursos
                </Link>
                <Link href="#" className="block hover:text-white">
                  Preços
                </Link>
                <Link href="#" className="block hover:text-white">
                  Roadmap
                </Link>
                <Link href="#" className="block hover:text-white">
                  Changelog
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <div className="space-y-2 text-slate-400">
                <Link href="#" className="block hover:text-white">
                  Central de Ajuda
                </Link>
                <Link href="#" className="block hover:text-white">
                  Contato
                </Link>
                <Link href="#" className="block hover:text-white">
                  Status
                </Link>
                <Link href="#" className="block hover:text-white">
                  API
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <div className="space-y-2 text-slate-400">
                <Link href="#" className="block hover:text-white">
                  Privacidade
                </Link>
                <Link href="#" className="block hover:text-white">
                  Termos
                </Link>
                <Link href="#" className="block hover:text-white">
                  Cookies
                </Link>
                <Link href="#" className="block hover:text-white">
                  LGPD
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-slate-400 text-sm">© 2024 Planly. Todos os direitos reservados.</p>
            <p className="text-slate-400 text-sm mt-4 md:mt-0">Feito com ❤️ para organizar sua vida</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
