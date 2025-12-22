'use client'

import React from 'react'
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CHART_COLORS } from '@/lib/constants'

export interface LineChartData {
  name: string
  value: number
  [key: string]: string | number
}

interface LineChartProps {
  data: LineChartData[]
  title?: string
  description?: string
  dataKey?: string
  nameKey?: string
  color?: string
  height?: number
  showLegend?: boolean
  showGrid?: boolean
  showDots?: boolean
  curved?: boolean
  className?: string
  formatValue?: (value: number) => string
  formatLabel?: (label: string) => string
}

export function LineChart({
  data,
  title,
  description,
  dataKey = 'value',
  nameKey = 'name',
  color = CHART_COLORS.primary,
  height = 300,
  showLegend = false,
  showGrid = true,
  showDots = true,
  curved = true,
  className,
  formatValue = (value) => value.toString(),
  formatLabel = (label) => label,
}: LineChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{formatLabel(label)}</p>
          <p className="text-sm text-gray-600">
            <span 
              className="inline-block w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: color }} 
            />
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
        <RechartsLineChart
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
          <Line 
            type={curved ? "monotone" : "linear"}
            dataKey={dataKey} 
            stroke={color}
            strokeWidth={2}
            dot={showDots ? { fill: color, strokeWidth: 2, r: 4 } : false}
            activeDot={{ r: 6, fill: color }}
          />
        </RechartsLineChart>
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
export function PerformanceTrendChart({ 
  data, 
  className,
  ...props 
}: Omit<LineChartProps, 'title' | 'description' | 'formatValue' | 'data'> & {
  data: Array<{ exam: string; average: number }>
}) {
  const chartData = data.map(item => ({
    name: item.exam,
    value: item.average
  }))

  return (
    <LineChart
      data={chartData}
      title="Performance Trend"
      description="Class average performance across different exams"
      formatValue={(value) => `${value.toFixed(1)}%`}
      color={CHART_COLORS.primary}
      className={className}
      {...props}
    />
  )
}

export function AttendanceTrendChart({
  data,
  className,
  ...props
}: Omit<LineChartProps, 'title' | 'description' | 'formatValue' | 'data'> & {
  data: Array<{ month: string; attendance: number }>
}) {
  const chartData = data.map(item => ({
    name: item.month,
    value: item.attendance
  }))

  return (
    <LineChart
      data={chartData}
      title="Attendance Trend"
      description="Monthly attendance percentage"
      formatValue={(value) => `${value.toFixed(1)}%`}
      color={CHART_COLORS.secondary}
      className={className}
      {...props}
    />
  )
}

// Multi-line chart for comparing subjects over time
export function SubjectComparisonChart({
  data,
  subjects,
  className,
  ...props
}: Omit<LineChartProps, 'title' | 'description' | 'dataKey' | 'color' | 'data'> & {
  data: Array<{ [key: string]: any }>
  subjects: string[]
}) {
  const colors = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.accent,
    CHART_COLORS.warning,
    CHART_COLORS.muted,
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-gray-600">
              <span 
                className="inline-block w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }} 
              />
              {entry.dataKey}: {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const content = (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Subject Performance Comparison</CardTitle>
        <CardDescription>
          Compare performance trends across different subjects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsLineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {subjects.map((subject, index) => (
              <Line 
                key={subject}
                type="monotone"
                dataKey={subject} 
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )

  return content
}
