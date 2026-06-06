import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.SHEETS_WEBHOOK_URL
  if (!webhookUrl) {
    return NextResponse.json({ error: 'SHEETS_WEBHOOK_URL no configurado' }, { status: 500 })
  }

  try {
    const body = await req.json()
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const result = await response.json()
    return NextResponse.json(result)
  } catch (err) {
    console.error('Error enviando a Sheets webhook:', err)
    return NextResponse.json({ error: 'Error al conectar con Google Sheets' }, { status: 502 })
  }
}
