'use client'

import React from 'react'
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CHART_COLORS } from '@/lib/constants'

export interface PieChartData {
  name: string
  value: number
  color?: string
  [key: string]: string | number | undefined
}

interface PieChartProps {
  data: PieChartData[]
  title?: string
  description?: string
  height?: number
  showLegend?: boolean
  showLabels?: boolean
  innerRadius?: number
  outerRadius?: number
  className?: string
  colors?: string[]
  formatValue?: (value: number) => string
  formatPercentage?: (value: number, total: number) => string
}

export function PieChart({
  data,
  title,
  description,
  height = 300,
  showLegend = true,
  showLabels = true,
  innerRadius = 0,
  outerRadius = 80,
  className,
  colors = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.accent, CHART_COLORS.warning, CHART_COLORS.muted],
  formatValue = (value) => value.toString(),
  formatPercentage = (value, total) => `${((value / total) * 100).toFixed(1)}%`,
}: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            <span 
              className="inline-block w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: data.color || colors[payload[0].payload.index] }} 
            />
            {formatValue(data.value)} ({formatPercentage(data.value, total)})
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null // Don't show labels for slices < 5%
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <ul className="flex flex-wrap justify-center mt-4 space-x-4">
        {payload.map((entry: any, index: number) => (
          <li key={index} className="flex items-center text-sm">
            <span 
              className="inline-block w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">{entry.value}</span>
          </li>
        ))}
      </ul>
    )
  }

  const content = (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={showLabels ? CustomLabel : false}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || colors[index % colors.length]} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend content={<CustomLegend />} />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )

  if (title || description) {
    return (
      <Card className={className}>
        <CardHeader>
          {title && <CardTitle className="text-lg">{title}</CardTitle>}
          {description && (
            <CardDescription className="text-sm text-gray-600">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    )
  }

  return content
}

// Specialized components for common use cases
export function PassFailChart({
  data,
  className,
  ...props
}: Omit<PieChartProps, 'title' | 'description' | 'colors' | 'formatValue' | 'data'> & {
  data: Array<{ name: 'Passed' | 'Failed'; value: number }>
}) {
  const passFailColors = [CHART_COLORS.secondary, CHART_COLORS.warning] // Green for pass, orange for fail
  
  return (
    <PieChart
      data={data}
      title="Pass/Fail Distribution"
      description="Overall class performance breakdown"
      colors={passFailColors}
      formatValue={(value) => `${value} student${value === 1 ? '' : 's'}`}
      className={className}
      {...props}
    />
  )
}

export function DonutChart({
  data,
  className,
  ...props
}: PieChartProps) {
  return (
    <PieChart
      data={data}
      innerRadius={40}
      outerRadius={80}
      className={className}
      {...props}
    />
  )
}

// Performance breakdown chart
export function PerformanceLevelChart({
  data,
  className,
  ...props
}: Omit<PieChartProps, 'title' | 'description' | 'colors' | 'data'> & {
  data: Array<{ 
    name: 'Excellent' | 'Good' | 'Average' | 'Below Average' | 'Poor'
    value: number 
  }>
}) {
  const performanceColors = [
    CHART_COLORS.secondary, // Excellent - Green
    CHART_COLORS.primary,   // Good - Blue
    CHART_COLORS.accent,    // Average - Orange
    CHART_COLORS.warning,   // Below Average - Red
    CHART_COLORS.muted,     // Poor - Gray
  ]
  
  return (
    <PieChart
      data={data}
      title="Performance Level Distribution"
      description="Students categorized by performance level"
      colors={performanceColors}
      className={className}
      {...props}
    />
  )
}
