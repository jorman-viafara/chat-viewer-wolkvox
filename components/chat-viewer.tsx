"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Phone, Clock, User, Search, Activity, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ChatMessage {
  session_id: string
  channel: string
  rp_id: string
  date: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_query: string
  routing_answer: string
  customer_id: string
  conn_id: string
}

interface ChatViewerProps {
  messages: ChatMessage[]
  loading: boolean
  hasSearched: boolean
}

interface GroupedChat {
  id: string
  customer_name: string
  customer_phone: string
  messages: ChatMessage[]
  lastMessage: Date
  totalMessages: number
}

export function ChatViewer({ messages, loading, hasSearched }: ChatViewerProps) {
  const [activeChat, setActiveChat] = useState<GroupedChat | null>(null)
  const [filter, setFilter] = useState("")

  const groupedChats = useMemo(() => {
    if (!messages.length) return []

    const chatGroups = new Map<string, GroupedChat>()

    messages.forEach((message) => {
      const chatId = message.customer_phone || message.session_id

      if (!chatGroups.has(chatId)) {
        chatGroups.set(chatId, {
          id: chatId,
          customer_name: message.customer_name || "Usuario Anónimo",
          customer_phone: message.customer_phone,
          messages: [],
          lastMessage: new Date(message.date),
          totalMessages: 0,
        })
      }

      const chat = chatGroups.get(chatId)!
      chat.messages.push(message)
      chat.totalMessages++

      const messageDate = new Date(message.date)
      if (messageDate > chat.lastMessage) {
        chat.lastMessage = messageDate
      }
    })

    return Array.from(chatGroups.values())
      .filter((c) => c.customer_phone?.includes(filter))
      .sort((a, b) => b.lastMessage.getTime() - a.lastMessage.getTime())
  }, [messages, filter])

  if (!hasSearched) {
    return (
      <Card className="text-center py-20 shadow-2xl border-0 bg-slate-800/80 backdrop-blur-sm animate-fade-in">
        <CardContent>
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="p-6 bg-gradient-to-br from-blue-800/50 to-slate-700/50 rounded-2xl">
                <Search className="h-12 w-12 text-blue-400" />
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-full animate-pulse">
                <Activity className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white">Busca conversaciones</h3>
              <p className="text-blue-200/80 text-lg max-w-md">
                Configura las fechas y token para comenzar a visualizar los chats de manera elegante
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="shadow-2xl border-0 bg-slate-800/80 backdrop-blur-sm animate-fade-in">
        <CardContent className="py-20">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600/20 border-t-blue-400" />
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-400/10" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-semibold text-white">Cargando conversaciones...</p>
              <p className="text-blue-200/80">Procesando datos del reporte</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // --- Vista de conversación estilo WhatsApp ---
  if (activeChat) {
    return (
      <Card className="shadow-xl border-0 bg-slate-900/95 backdrop-blur-md animate-fade-in h-[80vh] flex flex-col">
        {/* Header tipo WhatsApp */}
        <CardHeader className="flex items-center gap-4 bg-slate-800/80 p-4 border-b border-slate-700">
          <button onClick={() => setActiveChat(null)} className="p-2 rounded-full hover:bg-slate-700/60">
            <ArrowLeft className="h-5 w-5 text-blue-300" />
          </button>
          <Avatar className="h-12 w-12 bg-gradient-to-br from-blue-600 to-blue-700 shadow-md">
            <AvatarFallback className="text-white font-bold">
              {activeChat.customer_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-white text-lg">{activeChat.customer_name}</CardTitle>
            <p className="text-blue-200/70 text-sm flex items-center gap-2">
              <Phone className="h-3 w-3" /> {activeChat.customer_phone || "Sin teléfono"}
            </p>
          </div>
        </CardHeader>

        {/* Conversación */}
        <CardContent className="flex-1 p-4 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="flex flex-col space-y-4">
              {activeChat.messages
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((message, i) => (
                  <div key={i} className="flex flex-col space-y-2">
                    {message.customer_query && (
                      <div className="flex justify-end">
                        <div className="bg-green-600 text-white rounded-2xl rounded-br-md px-4 py-2 max-w-[70%] shadow-md">
                          <p className="text-sm leading-relaxed">{message.customer_query}</p>
                          <p className="text-[10px] opacity-70 text-right mt-1">
                            {format(new Date(message.date), "HH:mm", { locale: es })}
                          </p>
                        </div>
                      </div>
                    )}
                    {message.routing_answer && (
                      <div className="flex justify-start">
                        <div className="bg-slate-700 text-blue-100 rounded-2xl rounded-bl-md px-4 py-2 max-w-[70%] shadow-md">
                          <p className="text-sm leading-relaxed">{message.routing_answer}</p>
                          <p className="text-[10px] opacity-70 mt-1">
                            {format(new Date(message.date), "HH:mm", { locale: es })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    )
  }

  // --- Lista de chats (inbox) ---
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between p-6 bg-slate-800/50 border border-blue-600/30 backdrop-blur-sm rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <MessageCircle className="h-7 w-7 text-blue-400" />
          </div>
          Conversaciones ({groupedChats.length})
        </h2>
        <Badge variant="secondary" className="text-base px-4 py-2 bg-blue-600/20 text-blue-300 border-blue-500/50">
          {messages.length} mensajes totales
        </Badge>
      </div>

      {/* Input de filtro siempre visible */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Filtrar por número..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {groupedChats.length === 0 ? (
        <p className="text-center text-blue-200/70 text-lg py-10">
          No se encontraron conversaciones para el número buscado.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
          {groupedChats.map((chat, index) => (
            <Card
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className="cursor-pointer shadow-xl border-blue-600/30 bg-slate-800/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] animate-fade-in-up group hover:bg-slate-800/70"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                    <AvatarFallback className="text-white font-bold text-lg">
                      {chat.customer_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl truncate flex items-center gap-2 group-hover:text-blue-400 transition-colors text-white">
                      <User className="h-5 w-5 flex-shrink-0" />
                      {chat.customer_name}
                    </CardTitle>
                    {chat.customer_phone && (
                      <p className="text-sm text-blue-200/80 flex items-center gap-2 mt-2">
                        <Phone className="h-4 w-4" />
                        {chat.customer_phone}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-sm px-3 py-1 bg-blue-600/20 text-blue-300 border-blue-500/50">
                    {chat.totalMessages} mensajes
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-blue-200/80">
                    <Clock className="h-4 w-4" />
                    {format(chat.lastMessage, "dd/MM/yyyy HH:mm", { locale: es })}
                  </div>
                </div>
                <p className="text-sm text-blue-100/70 truncate">
                  {chat.messages[chat.messages.length - 1]?.customer_query ||
                    chat.messages[chat.messages.length - 1]?.routing_answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
