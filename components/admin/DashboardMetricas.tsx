'use client'

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

type Props = {
  totalInvitados: number
  totalConfirmados: number
  totalPendientes: number
  familiasConfirmadas: number
}

export default function DashboardMetricas({
  totalInvitados,
  totalConfirmados,
  totalPendientes,
  familiasConfirmadas,
}: Props) {

  const chartData = [
    { name: 'Confirmados', value: totalConfirmados },
    { name: 'Pendientes', value: totalPendientes },
  ]

  const COLORS = ['#16a34a', '#f59e0b']

  return (
    <div className="mb-10 bg-[#fffaf6] border border-[#e8dfd6] rounded-2xl p-6 shadow-sm">

      <div className="flex flex-col md:flex-row gap-6 items-center">

        {/* 📊 MÉTRICAS */}
        <div className="w-full md:w-1/2 text-lg space-y-3">

          <div>
            Total invitados:{' '}
            <span className="font-bold text-blue-700">
              {totalInvitados}
            </span>
          </div>

          <div>
            Total asistentes confirmados:{' '}
            <span className="font-bold text-green-700">
              {totalConfirmados}
            </span>
          </div>

          <div>
            Asistentes pendientes por confirmar:{' '}
            <span className="font-bold text-yellow-700">
              {totalPendientes}
            </span>
          </div>

          <div>
            Familias confirmadas:{' '}
            <span className="font-bold text-orange-700">
              {familiasConfirmadas}
            </span>
          </div>

        </div>

        {/* 🥧 GRÁFICA */}
        <div className="w-full md:w-1/2 flex flex-col items-center">

          <h2 className="text-lg font-semibold text-center mb-3">
            Estado de confirmaciones
          </h2>

          <div className="w-full h-52 min-[355px]:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={36}
                  outerRadius={70}
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Leyenda */}
          <div
            className="
            flex flex-col items-start gap-2
            min-[355px]:flex-row
            min-[355px]:items-center
            min-[355px]:justify-center
            min-[355px]:gap-6
            mt-4 text-sm
          "
          >
            {chartData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-gray-700">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  )
}
