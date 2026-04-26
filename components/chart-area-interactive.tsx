"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

const chartConfig = {
  value: {
    label: "Water Level : ",
    color: "var(--primary)",
  },
} satisfies ChartConfig

interface ChartAreaInteractiveProps {
  data: {
    timestamp: string
    value: number
  }[]
}

export function ChartAreaInteractive({ data = [] }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("24h")

  React.useEffect(() => {
    if (isMobile) setTimeRange("8h")
  }, [isMobile])

  const filteredData = React.useMemo(() => {
    if (!data || data.length === 0) return []
        
    const latestDate = new Date(data[data.length - 1].timestamp)
    let hoursToSubtract = 24
    if (timeRange === "8h") hoursToSubtract = 8
    else if (timeRange === "1h") hoursToSubtract = 1

    const hoursToMs = hoursToSubtract * 60 * 60 * 1000
    const latestDateInMs = latestDate.getTime()

    const startDate = new Date(latestDateInMs - hoursToMs)
    return data.filter((item) => new Date(item.timestamp) >= startDate)
  }, [data, timeRange])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Monitoring Per Jam</CardTitle>
        <CardDescription>
          {timeRange === '24h' ? '24 Jam Terakhir' : timeRange === '8h' ? '8 Jam Terakhir' : '1 Jam Terakhir'}
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(v) => v && setTimeRange(v)}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="24h">24 Jam</ToggleGroupItem>
            <ToggleGroupItem value="8h">8 Jam</ToggleGroupItem>
            <ToggleGroupItem value="1h">1 Jam</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-35 @[767px]/card:hidden" size="sm">
              <SelectValue placeholder="Pilih Waktu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Jam</SelectItem>
              <SelectItem value="8h">8 Jam</SelectItem>
              <SelectItem value="1h">1 Jam</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                const formattedTime = date.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Makassar",
                  timeZoneName: "short"
                })
                return formattedTime
              }}
            />
           <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                formatter={(value, name, props) => {
                  const { timestamp } = props.payload;
                  const formattedTime = new Date(timestamp).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Makassar",
                    timeZoneName: "short",
                  });
                  return (
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Waktu: {formattedTime}
                      </span>
                      <span className="font-bold">
                        {name}: {value} cm
                      </span>
                    </div>
                  )
                }}
                indicator="line"
                />
              }
            />
            <Area
              dataKey="value"
              type="monotone"
              fill="url(#fillValue)"
              stroke="var(--primary)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}