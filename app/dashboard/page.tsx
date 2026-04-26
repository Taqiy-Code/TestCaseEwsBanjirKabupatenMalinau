import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { getStatus } from "@/lib/status"

import prisma from "@/lib/prisma"
import { timeStamp } from "console"

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

      const historiesReading = await prisma.sensorReading.findMany({
        where : { sensor_id : sensor.id },
        orderBy : { timestamp : 'asc' },
        take : -1440,
      })
      
      const chartData = historiesReading.map(reading => ({
        timestamp: reading.timestamp,
        value: Number(reading.value.toFixed(2)),
      }))


      return {
        ...sensor,
        latestReading,
        currentStatus,
        chartData,
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                
                {dashboardData.map((data: any, index: number) => (
                  <div className="flex flex-col gap-4 h-full" key={index}>
                    
                    <div className="flex-1">
                      <SectionCards data={data} />
                    </div>
                    
                    <div className="flex-2"> 
                      <ChartAreaInteractive data={data.chartData}/> 
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
