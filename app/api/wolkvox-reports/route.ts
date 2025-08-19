import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  // ahora ya esperamos formato YYYYMMDDHHMMSS directamente
  const dateIni = searchParams.get("date_ini") 
  const dateEnd = searchParams.get("date_end") 
  const token = request.headers.get("wolkvox-token")
  const server = request.headers.get("wolkvox-server")

  if (!dateIni || !dateEnd) {
    return NextResponse.json({ error: "Faltan parámetros de fecha" }, { status: 400 })
  }

  if (!token || !server) {
    return NextResponse.json({ error: "Token y servidor de Wolkvox requeridos" }, { status: 401 })
  }

  try {
    // usamos directamente lo que recibimos
    const apiUrl = `https://wv${server}.wolkvox.com/api/v2/reports_manager.php?api=diagram_9&date_ini=${dateIni}&date_end=${dateEnd}`

    const response = await fetch(apiUrl, {
      headers: {
        "wolkvox-server": server,  // obligatorio
        "wolkvox-token": token,    // obligatorio
        "Content-Type": "application/json",
      },
    })

    if (response.status === 404) {
      // 🔥 Wolkvox devuelve 404 cuando no hay conversaciones
      return NextResponse.json({ messages: [] })
    }

    if (!response.ok) {
      throw new Error(`Error de la API de Wolkvox: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error al obtener datos de Wolkvox:", error)
    return NextResponse.json({ error: "Error al obtener datos del reporte" }, { status: 500 })
  }
}
