import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageCircle,
  Mail,
  Phone,
  Search,
  HelpCircle,
  FileText,
  PlayCircle,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const faqCategories = [
  {
    id: "general",
    name: "Général",
    icon: HelpCircle,
    questions: [
      {
        q: "Qu'est-ce qu'AvyBoost ?",
        a: "AvyBoost est une plateforme de croissance sociale qui vous permet d'améliorer votre présence sur les réseaux sociaux à travers l'achat de services d'engagement (likes, followers, vues, etc.).",
      },
      {
        q: "Est-ce sécurisé ?",
        a: "Oui, toutes nos transactions sont sécurisées et nous ne demandons jamais vos mots de passe. Nous utilisons uniquement des méthodes de paiement reconnues et sécurisées.",
      },
      {
        q: "Quelles plateformes sont supportées ?",
        a: "Nous supportons TikTok, Instagram, Facebook, YouTube, Twitter/X, Telegram et WhatsApp.",
      },
    ],
  },
  {
    id: "orders",
    name: "Commandes",
    icon: FileText,
    questions: [
      {
        q: "Combien de temps prend la livraison ?",
        a: "La livraison standard commence sous 24h et peut prendre de quelques heures à quelques jours selon la quantité. L'option Express accélère le processus.",
      },
      {
        q: "Puis-je annuler ma commande ?",
        a: "Vous pouvez annuler une commande en attente. Une fois le traitement commencé, l'annulation n'est plus possible mais vous serez remboursé pour la partie non livrée.",
      },
      {
        q: "Comment suivre ma commande ?",
        a: "Rendez-vous dans la section 'Mes Commandes' pour voir l'état en temps réel de toutes vos commandes avec une barre de progression.",
      },
    ],
  },
  {
    id: "payment",
    name: "Paiement",
    icon: AlertCircle,
    questions: [
      {
        q: "Quels modes de paiement acceptez-vous ?",
        a: "Nous acceptons Orange Money, MTN Mobile Money, Visa et Mastercard. Le montant minimum de recharge est de 500 XAF.",
      },
      {
        q: "Comment être remboursé ?",
        a: "En cas d'échec de livraison, le remboursement est automatique sur votre portefeuille AvyBoost sous 24-48h.",
      },
      {
        q: "Mon paiement est bloqué, que faire ?",
        a: "Contactez notre support via WhatsApp ou créez un ticket. Gardez votre référence de transaction à portée de main.",
      },
    ],
  },
];

const guides = [
  { title: "Comment commander des followers", platform: "TikTok", duration: "3 min" },
  { title: "Optimiser votre profil Instagram", platform: "Instagram", duration: "5 min" },
  { title: "Guide du programme de fidélité", platform: "Général", duration: "2 min" },
  { title: "Utiliser le parrainage", platform: "Général", duration: "4 min" },
];

const tickets = [
  { id: "TKT-001", subject: "Problème de paiement", status: "open", date: "2024-01-17" },
  { id: "TKT-002", subject: "Commande non livrée", status: "resolved", date: "2024-01-15" },
];

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("faq");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");

  const handleCreateTicket = () => {
    if (!ticketSubject || !ticketMessage) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    toast.success("Ticket créé avec succès ! Nous vous répondrons sous 24h.");
    setTicketSubject("");
    setTicketMessage("");
  };

  const handleWhatsAppContact = () => {
    window.open("https://wa.me/237620462308", "_blank");
  };

  const filteredFAQ = faqCategories.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Centre d'<span className="gradient-text">Aide</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trouvez des réponses à vos questions ou contactez notre support 24/7
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleWhatsAppContact}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-semibold mb-1">WhatsApp</h3>
                <p className="text-sm text-muted-foreground">+237 620 462 308</p>
                <Badge className="mt-2 bg-green-500/10 text-green-600">24/7</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-sm text-muted-foreground">avydigitalbusiness@gmail.com</p>
                <Badge variant="secondary" className="mt-2">Réponse sous 24h</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Chat en direct</h3>
                <p className="text-sm text-muted-foreground">Support instantané</p>
                <Badge className="mt-2 bg-green-500/10 text-green-600">En ligne</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="faq">
                <HelpCircle className="w-4 h-4 mr-2" />
                FAQ
              </TabsTrigger>
              <TabsTrigger value="guides">
                <PlayCircle className="w-4 h-4 mr-2" />
                Guides
              </TabsTrigger>
              <TabsTrigger value="tickets">
                <FileText className="w-4 h-4 mr-2" />
                Mes Tickets
              </TabsTrigger>
            </TabsList>

            {/* FAQ Tab */}
            <TabsContent value="faq">
              {/* Search */}
              <div className="relative max-w-md mx-auto mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans la FAQ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* FAQ Categories */}
              <div className="space-y-6">
                {(searchQuery ? filteredFAQ : faqCategories).map((category) => (
                  <Card key={category.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <category.icon className="w-5 h-5 text-primary" />
                        {category.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((item, idx) => (
                          <AccordionItem key={idx} value={`${category.id}-${idx}`}>
                            <AccordionTrigger className="text-left">
                              {item.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {item.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Guides Tab */}
            <TabsContent value="guides">
              <div className="grid md:grid-cols-2 gap-4">
                {guides.map((guide, idx) => (
                  <Card key={idx} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <PlayCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{guide.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">{guide.platform}</Badge>
                          <span>•</span>
                          <span>{guide.duration}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tickets Tab */}
            <TabsContent value="tickets">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Create Ticket */}
                <Card>
                  <CardHeader>
                    <CardTitle>Créer un ticket</CardTitle>
                    <CardDescription>
                      Décrivez votre problème et nous vous répondrons rapidement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Input
                        placeholder="Sujet du ticket"
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Décrivez votre problème en détail..."
                        rows={5}
                        value={ticketMessage}
                        onChange={(e) => setTicketMessage(e.target.value)}
                      />
                    </div>
                    <Button className="w-full gradient-primary" onClick={handleCreateTicket}>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer le ticket
                    </Button>
                  </CardContent>
                </Card>

                {/* My Tickets */}
                <Card>
                  <CardHeader>
                    <CardTitle>Mes tickets</CardTitle>
                    <CardDescription>Historique de vos demandes de support</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {tickets.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Aucun ticket</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {tickets.map((ticket) => (
                          <div
                            key={ticket.id}
                            className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                          >
                            <div>
                              <p className="font-medium">{ticket.subject}</p>
                              <p className="text-sm text-muted-foreground">
                                {ticket.id} • {ticket.date}
                              </p>
                            </div>
                            <Badge
                              className={
                                ticket.status === "open"
                                  ? "bg-yellow-500/10 text-yellow-600"
                                  : "bg-green-500/10 text-green-600"
                              }
                            >
                              {ticket.status === "open" ? (
                                <Clock className="w-3 h-3 mr-1" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                              )}
                              {ticket.status === "open" ? "Ouvert" : "Résolu"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
