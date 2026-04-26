import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { getStatus } from "@/lib/status"

import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"
export default async function Page() {
  const sensors = await prisma.sensor.findMany()
  const dashboardData = await Promise.all(
    sensors.map(async (sensor) => {
      const latestReading = await prisma.sensorReading.findFirst({
        where : {sensor_id: sensor.id},
        orderBy: { timestamp: 'desc' },
      })

      const currentStatus = latestReading ? getStatus(latestReading.value, sensor) : 'AMAN'

      return {
        ...sensor,
        latestReading,
        currentStatus,
      }
    })
  )

  return (
    <div
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            
            <div className="px-4 lg:px-6">
              {/* Gunakan GRID alih-alih FLEX */}
              {/* grid-cols-1 untuk HP, lg:grid-cols-3 untuk layar besar (sejajar 1 baris) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                
                {dashboardData.map((data: any, index: number) => (
                  // Gabungkan Card dan Chart dalam 1 kolom per sensor
                  <div className="flex flex-col gap-4 h-full" key={index}>
                    
                    {/* Card (Bagian Atas) */}
                    <div className="flex-1">
                      <SectionCards data={data} />
                    </div>
                    
                    {/* Chart (Bagian Bawah) */}
                    {/* Nanti Anda bisa mengoper data grafik ke dalam komponen ini */}
                    <div className="flex-[2]"> 
                      <ChartAreaInteractive /> 
                    </div>

                  </div>
                ))}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
