"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { getStatus, getStatusColor} from "@/lib/status"
import { BadgeCheck, Info, AlertTriangle, CheckCircle2 } from "lucide-react"

interface SectionCardProps {
  id: number
  name: string
  location: string
  currentStatus: string
  siaga_threshold: number
  waspada_threshold: number
  awas_threshold: number
  latestReading: any
}

function getStatusIcon(status: string) {
  switch (status) {
    case "AWAS": return <AlertTriangle/>
    case "WASPADA": return <AlertTriangle/>
    case "SIAGA": return <Info/>
    default: return <CheckCircle2 />
  }
}

export function SectionCards({ data }: { data: SectionCardProps }) {
  const isWaspadaOrAwas = data.currentStatus === "WASPADA" || data.currentStatus === "AWAS"
  const highlightedClass = isWaspadaOrAwas ? getStatusColor(data.currentStatus) : ""  

  return (
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-1 dark:*:data-[slot=card]:bg-card">
      <Card className={highlightedClass + " @container/card"}>
        <CardHeader>
          <CardDescription>{ data.location }</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            { data.name }
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={getStatusColor(data.currentStatus)}>
              {getStatusIcon(data.currentStatus)} {getStatus(data.latestReading.value, data)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Reading Terbaru: {data.latestReading.value} {data.latestReading.unit}
          </div>
          <div className="text-muted-foreground">
             {new Date(data.latestReading.timestamp).toLocaleString('id-ID', {
              weekday: 'long',  
              day: 'numeric',  
              month: 'long',   
              year: 'numeric',   
              hour: '2-digit',  
              minute: '2-digit',
              timeZone: 'Asia/Makassar',
              timeZoneName: 'short'      
            })}
          </div>
        </CardFooter>
      </Card>
    </div>    
  )
}
