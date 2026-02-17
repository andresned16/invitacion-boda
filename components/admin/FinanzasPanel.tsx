'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Plus, Trash2, Download } from 'lucide-react'
import {
  obtenerFinanzas,
  crearFinanza,
  actualizarFinanza,
  eliminarFinanza
} from '@/services/finanzas'

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

type FilaFinanza = {
  id: string
  concepto: string
  presupuesto: number
  pagado: number
}

export default function FinanzasPanel() {
  const [filas, setFilas] = useState<FilaFinanza[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const filasOriginales = useRef<FilaFinanza[]>([])
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // -----------------------------
  // Cargar datos iniciales
  // -----------------------------
  useEffect(() => {
    const load = async () => {
      const data = await obtenerFinanzas()
      setFilas(data)
      filasOriginales.current = JSON.parse(JSON.stringify(data))
      setLoading(false)
    }
    load()
  }, [])

  // -----------------------------
  // AUTO SAVE CON DEBOUNCE
  // -----------------------------
  useEffect(() => {
    if (loading) return

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setSaving(true)

      const updates: Promise<void>[] = []

      for (const fila of filas) {
        const original = filasOriginales.current.find(f => f.id === fila.id)
        if (!original) continue

        const huboCambio =
          original.concepto !== fila.concepto ||
          original.presupuesto !== fila.presupuesto ||
          original.pagado !== fila.pagado

        if (huboCambio) {
          updates.push(
            actualizarFinanza(
              fila.id,
              fila.concepto,
              fila.presupuesto,
              fila.pagado
            )
          )
        }
      }

      await Promise.all(updates)

      filasOriginales.current = JSON.parse(JSON.stringify(filas))
      setSaving(false)
    }, 800)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [filas, loading])

  // -----------------------------
  // Cálculos
  // -----------------------------
  const totalPresupuesto = useMemo(
    () => filas.reduce((acc, f) => acc + f.presupuesto, 0),
    [filas]
  )

  const totalPagado = useMemo(
    () => filas.reduce((acc, f) => acc + f.pagado, 0),
    [filas]
  )

  const totalPendiente = totalPresupuesto - totalPagado

  const dataGrafico = useMemo(() => {
    return filas.map(f => ({
      concepto: f.concepto || 'Sin nombre',
      presupuesto: f.presupuesto,
      pagado: f.pagado,
      pendiente: f.presupuesto - f.pagado
    }))
  }, [filas])

  // -----------------------------
  // Handlers
  // -----------------------------
  const actualizarCampo = (
    id: string,
    campo: keyof Omit<FilaFinanza, 'id'>,
    valor: string
  ) => {
    const nuevoValor =
      campo === 'concepto'
        ? valor
        : Number(valor.replace(/[^0-9]/g, '')) || 0

    setFilas(prev =>
      prev.map(f =>
        f.id === id ? { ...f, [campo]: nuevoValor } : f
      )
    )
  }

  const agregarFila = async () => {
    await crearFinanza('', 0, 0)
    const data = await obtenerFinanzas()
    setFilas(data)
    filasOriginales.current = JSON.parse(JSON.stringify(data))
  }

  const eliminarFilaHandler = async (id: string) => {
    await eliminarFinanza(id)
    setFilas(prev => prev.filter(f => f.id !== id))
    filasOriginales.current = filasOriginales.current.filter(f => f.id !== id)
  }
  const getBase64ImageFromUrl = async (url: string) => {
    const data = await fetch(url)
    const blob = await data.blob()

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        const base64data = reader.result as string
        resolve(base64data.split(',')[1]) // quitamos data:image/png;base64,
      }
      reader.onerror = reject
    })
  }

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Finanzas')
    // -----------------------------
    // LOGO
    // -----------------------------
    const logoBase64 = await getBase64ImageFromUrl('/images/sello.png')

    const imageId = workbook.addImage({
      base64: logoBase64,
      extension: 'png'
    })

    worksheet.addImage(imageId, {
      tl: { col: 0, row: 0 }, // esquina superior izquierda
      ext: { width: 120, height: 120 } // tamaño del logo
    })

    // -----------------------------
    // TÍTULO
    // -----------------------------
    worksheet.mergeCells('B1:D1')
    const titleCell = worksheet.getCell('B1')

    titleCell.value = 'Resumen Financiero - Boda'
    titleCell.font = { size: 16, bold: true, color: { argb: 'FF5C4632' } }
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getRow(1).height = 90


    worksheet.addRow([])

    // -----------------------------
    // ENCABEZADOS MANUALES
    // -----------------------------
    const headerRow = worksheet.addRow([
      'Concepto',
      'Presupuesto',
      'Pagado',
      'Pendiente'
    ])

    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF5C4632' }
      }
      cell.alignment = { horizontal: 'center', vertical: 'middle' }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    })

    worksheet.columns = [
      { key: 'concepto', width: 35 },
      { key: 'presupuesto', width: 18 },
      { key: 'pagado', width: 18 },
      { key: 'pendiente', width: 18 }
    ]

    // -----------------------------
    // DATOS CON FÓRMULAS
    // -----------------------------
    const startDataRow = 4 // fila donde empiezan los datos (después del header)

    filas.forEach((f, index) => {
      const currentRowNumber = startDataRow + index

      const row = worksheet.addRow([
        f.concepto,
        f.presupuesto,
        f.pagado,
        {
          formula: `B${currentRowNumber}-C${currentRowNumber}`
        }
      ])

      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }

        if (colNumber > 1) {
          cell.numFmt = '"$"#,##0'
          cell.alignment = { horizontal: 'right' }
        }
      })
    })

    const endDataRow = startDataRow + filas.length - 1

    worksheet.addRow([])

    // -----------------------------
    // TOTAL CON SUM REALES
    // -----------------------------
    const totalRowNumber = endDataRow + 2

    const totalRow = worksheet.addRow([
      'TOTAL',
      { formula: `SUM(B${startDataRow}:B${endDataRow})` },
      { formula: `SUM(C${startDataRow}:C${endDataRow})` },
      { formula: `SUM(D${startDataRow}:D${endDataRow})` }
    ])

    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true }
      cell.border = {
        top: { style: 'medium' },
        bottom: { style: 'medium' }
      }

      if (colNumber > 1) {
        cell.numFmt = '"$"#,##0'
        cell.alignment = { horizontal: 'right' }
      }
    })


    // -----------------------------
    // FILTRO Y FREEZE
    // -----------------------------
    worksheet.autoFilter = {
      from: 'A3',
      to: 'D3'
    }

    worksheet.views = [{ state: 'frozen', ySplit: 3 }]

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer])
    saveAs(blob, 'finanzas-boda.xlsx')
  }



  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value)

  const formatShortCurrency = (value: number) => {
    if (value >= 1_000_000) {
      return `${Math.round(value / 1_000_000)}M`
    }
    if (value >= 1_000) {
      return `${Math.round(value / 1_000)}K`
    }
    return value.toString()
  }

  if (loading) {
    return (
      <div className="mt-12 text-center text-[#5C4632]">
        Cargando finanzas...
      </div>
    )
  }

  return (
    <div className="mt-12 bg-[#fdfaf6] p-6 rounded-2xl shadow-md border border-[#e8dfd6]">
      <h2 className="text-2xl font-bentinck text-[#7a5c3e] text-center mb-4">
        Panel Financiero
      </h2>

      {saving && (
        <p className="text-center text-sm text-[#7a5c3e] mb-4">
          Guardando cambios...
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <MetricCard titulo="Presupuesto Total" valor={formatCurrency(totalPresupuesto)} />
        <MetricCard titulo="Total Pagado" valor={formatCurrency(totalPagado)} />
        <MetricCard titulo="Pendiente" valor={formatCurrency(totalPendiente)} destaque />
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#f4eee8] text-[#5C4632]">
            <tr>
              <th className="p-3 text-left">Concepto</th>
              <th className="p-3 text-left">Presupuesto</th>
              <th className="p-3 text-left">Pagado</th>
              <th className="p-3 text-left">Pendiente</th>
              <th className="p-3 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filas.map(fila => {
              const pendiente = fila.presupuesto - fila.pagado

              return (
                <tr key={fila.id} className="border-t border-[#eee]">
                  <td className="p-2">
                    <input
                      value={fila.concepto}
                      onChange={e =>
                        actualizarCampo(fila.id, 'concepto', e.target.value)
                      }
                      className="w-full bg-transparent border-b border-[#ddd] focus:outline-none"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      type="text"
                      value={fila.presupuesto || ''}
                      onChange={e =>
                        actualizarCampo(fila.id, 'presupuesto', e.target.value)
                      }
                      className="w-full bg-transparent border-b border-[#ddd] focus:outline-none"
                    />
                  </td>

                  <td className="p-2">
                    <input
                      type="text"
                      value={fila.pagado || ''}
                      onChange={e =>
                        actualizarCampo(fila.id, 'pagado', e.target.value)
                      }
                      className="w-full bg-transparent border-b border-[#ddd] focus:outline-none"
                    />
                  </td>

                  <td className="p-2 font-medium text-[#7a5c3e]">
                    {formatCurrency(pendiente)}
                  </td>

                  <td className="p-2">
                    <button
                      onClick={() => eliminarFilaHandler(fila.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* BOTONES */}
      <div className="mt-6 flex gap-4 flex-wrap">
        <button
          onClick={agregarFila}
          className="flex items-center gap-2 bg-[#5C4632] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          <Plus size={16} />
          Agregar concepto
        </button>

        <button
          onClick={exportarExcel}
          className="flex items-center gap-2 bg-[#b08968] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          <Download size={16} />
          Exportar Excel
        </button>
      </div>

      {/* GRÁFICO */}
      <div className="mt-12 h-[300px] sm:h-[360px] md:h-[420px] w-full">



        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={dataGrafico}
            margin={{ top: 20, right: 20, left: 10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis
              tickFormatter={formatShortCurrency}
              tick={{ fontSize: 10 }}
              width={60}
            />


            <Tooltip
              formatter={(value: number | undefined) =>
                formatCurrency(value ?? 0)
              }
            />
            <XAxis
              dataKey="concepto"
              interval={0}
              angle={-90}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 10 }}   // 👈 más pequeño
              tickMargin={40}           // 👈 separa del eje
              tickFormatter={(value: string) => value.split(' ')[0]}
            />

            <Legend />
            <Line
              type="monotone"
              dataKey="presupuesto"
              stroke="#5C4632"
              strokeWidth={2}
            />

            <Line
              type="monotone"
              dataKey="pagado"
              stroke="#4E9F5B"
              strokeWidth={2}
            />

            <Line
              type="monotone"
              dataKey="pendiente"
              stroke="#E0A03B"
              strokeWidth={2}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function MetricCard({
  titulo,
  valor,
  destaque = false
}: {
  titulo: string
  valor: string
  destaque?: boolean
}) {
  return (
    <div
      className={`p-4 rounded-xl border ${destaque
        ? 'bg-[#5C4632] text-white'
        : 'bg-white border-[#e8dfd6] text-[#5C4632]'
        }`}
    >
      <p className="text-xs uppercase tracking-wide opacity-70">
        {titulo}
      </p>
      <p className="text-lg font-bold mt-1">{valor}</p>
    </div>
  )
}
