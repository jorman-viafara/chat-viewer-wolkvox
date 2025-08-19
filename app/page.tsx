"use client"

import { useEffect, useState } from "react"
import { DateRangePicker } from "@/components/date-range-picker"
import { ChatViewer } from "@/components/chat-viewer"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Calendar, Activity, Building } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { isSameMonth } from "date-fns"

// Interfaces
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

interface ApiResponse {
  code: string
  error: string | null
  msg: string
  data: ChatMessage[]
}

interface Operacion {
  nombre: string
  token: string
  puerto: string
  carpeta: string
  subnombre: string
}

export default function WolkvoxChatViewer() {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [chatData, setChatData] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Estado para operaciones
  const [operaciones, setOperaciones] = useState<Operacion[]>([])
  const [selectedOperacion, setSelectedOperacion] = useState<Operacion | null>(null)

  // Obtener operaciones desde GitHub
  useEffect(() => {
    const fetchOperaciones = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/jorman-viafara/operaciones-informes/main/operaciones.json"
        )
        if (!res.ok) throw new Error("No se pudieron cargar las operaciones")
        const data: Operacion[] = await res.json()
        setOperaciones(data)
      } catch (error) {
        console.error("Error cargando operaciones:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las operaciones desde GitHub",
          variant: "destructive",
        })
      }
    }
    fetchOperaciones()
  }, [])

  const formatDateForApi = (date: Date, isEndDate = false) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const time = isEndDate ? "235959" : "000000"
    return `${year}${month}${day}${time}`
  }

  const handleSearch = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Error",
        description: "Por favor selecciona un rango de fechas",
        variant: "destructive",
      })
      return
    }

    if (!isSameMonth(dateRange.from, dateRange.to)) {
      toast({
        title: "Error de validación",
        description: "Solo se pueden generar reportes del mismo mes",
        variant: "destructive",
      })
      return
    }

    if (!selectedOperacion) {
      toast({
        title: "Error",
        description: "Por favor selecciona una operación",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const dateIni = formatDateForApi(dateRange.from)
      const dateEnd = formatDateForApi(dateRange.to, true)

      const response = await fetch(
        `/api/wolkvox-reports?date_ini=${encodeURIComponent(dateIni)}&date_end=${encodeURIComponent(dateEnd)}`,
        {
          headers: {
            "wolkvox-token": selectedOperacion.token,
            "wolkvox-server": selectedOperacion.puerto,
          },
        },
      )

      if (!response.ok) {
        console.error("Error en la API:", response.statusText)
        toast({
          title: "Error",
          description: "No se pudo conectar con la API",
          variant: "destructive",
        })
        setChatData([])
        return
      }

      const data: ApiResponse = await response.json()

      if (data.code === "200" && data.data && data.data.length > 0) {
        setChatData(data.data)
        toast({
          title: "Éxito",
          description: `Se encontraron ${data.data.length} mensajes`,
        })
      } else {
        // en lugar de throw, mostramos aviso y limpiamos el estado
        setChatData([])
        toast({
          title: "Sin resultados",
          description: "No se encontraron conversaciones para los filtros seleccionados",
        })
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Error inesperado al obtener los datos del reporte",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 relative overflow-hidden">
      {/* Marca de agua */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute top-20 left-20 text-blue-300/20 text-6xl font-bold transform -rotate-45">@JormanDEV</div>
        <div className="absolute bottom-20 right-20 text-blue-300/20 text-6xl font-bold transform rotate-45">@JormanDEV</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-300/10 text-8xl font-bold">
          @JormanDEV
        </div>
      </div>

      <div className="relative z-20 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg animate-pulse-glow">
              <Activity className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
                Chat Viewer
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full mx-auto"></div>
            </div>
          </div>
          <p className="text-blue-200/80 text-xl max-w-2xl mx-auto leading-relaxed">
            Visualizar y analizar las conversaciones con una interfaz de las operaciones
          </p>
        </div>

        {/* Configuración */}
        <Card className="mb-12 shadow-2xl border-0 bg-slate-800/80 backdrop-blur-sm animate-fade-in-up">
          <CardHeader className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-blue-600/30">
            <CardTitle className="flex items-center gap-3 text-2xl text-white">
              <Calendar className="h-6 w-6 text-blue-400" />
              Configuración de Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Operación */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2 text-blue-200">
                  <Building className="h-4 w-4 text-blue-400" />
                  Seleccionar Operación
                </Label>
                <select
                  value={selectedOperacion?.nombre || ""}
                  onChange={(e) =>
                    setSelectedOperacion(operaciones.find((op) => op.nombre === e.target.value) || null)
                  }
                  className="h-12 w-full rounded-lg bg-slate-700/50 border border-blue-600/50 text-white px-3 focus:border-blue-400"
                >
                  <option value="">-- Selecciona una operación --</option>
                  {operaciones.map((op) => (
                    <option key={op.nombre} value={op.nombre}>
                      {op.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2 text-blue-200">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  Rango de Fechas (mismo mes)
                </Label>
                <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-white border-0"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                    Buscando conversaciones...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-3" />
                    Buscar Conversaciones
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chat Viewer */}
        <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <ChatViewer messages={chatData} loading={loading} hasSearched={hasSearched} />
        </div>
      </div>
    </div>
  )
}
