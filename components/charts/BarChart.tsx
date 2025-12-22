'use client'

import React from 'react'
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CHART_COLORS } from '@/lib/constants'

export interface BarChartData {
  name: string
  value: number
  [key: string]: string | number
}

interface BarChartProps {
  data: BarChartData[]
  title?: string
  description?: string
  dataKey?: string
  nameKey?: string
  color?: string
  height?: number
  showLegend?: boolean
  showGrid?: boolean
  className?: string
  formatValue?: (value: number) => string
  formatLabel?: (label: string) => string
}

export function BarChart({
  data,
  title,
  description,
  dataKey = 'value',
  nameKey = 'name',
  color = CHART_COLORS.primary,
  height = 300,
  showLegend = false,
  showGrid = true,
  className,
  formatValue = (value) => value.toString(),
  formatLabel = (label) => label,
}: BarChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{formatLabel(label)}</p>
          <p className="text-sm text-gray-600">
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }} />
            {formatValue(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  const content = (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          <XAxis
            dataKey={nameKey}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={formatLabel}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={formatValue}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        </RechartsBarChart>
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
interface SubjectAverageChartProps extends Omit<BarChartProps, 'title' | 'description' | 'formatValue' | 'data'> {
  data: Array<{ subject: string; average: number }>
}

export function SubjectAverageChart({ 
  data, 
  className,
  ...props 
}: SubjectAverageChartProps) {
  const chartData = data.map(item => ({
    name: item.subject,
    value: item.average
  }))

  return (
    <BarChart
      data={chartData}
      title="Subject-wise Average Marks"
      description="Average performance across all subjects"
      formatValue={(value) => `${value.toFixed(1)}`}
      color={CHART_COLORS.primary}
      className={className}
      {...props}
    />
  )
}

interface GradeDistributionChartProps extends Omit<BarChartProps, 'title' | 'description' | 'formatValue' | 'data'> {
  data: Array<{ grade: string; count: number }>
}

export function GradeDistributionChart({
  data,
  className,
  ...props
}: GradeDistributionChartProps) {
  const chartData = data.map(item => ({
    name: item.grade,
    value: item.count
  }))

  return (
    <BarChart
      data={chartData}
      title="Grade Distribution"
      description="Number of students in each grade category"
      formatValue={(value) => `${value} student${value === 1 ? '' : 's'}`}
      color={CHART_COLORS.secondary}
      className={className}
      {...props}
    />
  )
}
