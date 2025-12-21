'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn, formatNumber, formatPercentage } from '@/lib/utils'

export interface TableColumn<T = any> {
  key: string
  header: string
  accessor: keyof T | ((row: T) => any)
  sortable?: boolean
  filterable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  format?: (value: any, row: T) => React.ReactNode
  className?: string
}

export interface DataTableProps<T = any> {
  data: T[]
  columns: TableColumn<T>[]
  title?: string
  description?: string
  searchable?: boolean
  sortable?: boolean
  pagination?: boolean
  pageSize?: number
  loading?: boolean
  emptyMessage?: string
  className?: string
  onRowClick?: (row: T, index: number) => void
  rowClassName?: (row: T, index: number) => string
}

type SortOrder = 'asc' | 'desc' | null

export function DataTable<T = any>({
  data,
  columns,
  title,
  description,
  searchable = false,
  sortable = true,
  pagination = true,
  pageSize = 10,
  loading = false,
  emptyMessage = 'No data available',
  className,
  onRowClick,
  rowClassName,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data

    const lowercaseSearch = searchTerm.toLowerCase()
    return data.filter((row) => {
      return columns.some((column) => {
        const value = typeof column.accessor === 'function' 
          ? column.accessor(row)
          : row[column.accessor]
        
        return String(value || '').toLowerCase().includes(lowercaseSearch)
      })
    })
  }, [data, searchTerm, columns])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortOrder) return filteredData

    const column = columns.find(col => col.key === sortColumn)
    if (!column) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = typeof column.accessor === 'function' 
        ? column.accessor(a)
        : a[column.accessor]
      const bValue = typeof column.accessor === 'function' 
        ? column.accessor(b)
        : b[column.accessor]

      if (aValue === bValue) return 0

      let comparison = 0
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue
      } else {
        comparison = String(aValue || '').localeCompare(String(bValue || ''))
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortColumn, sortOrder, columns])

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData
    
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize, pagination])

  // Pagination info
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(startIndex + pageSize - 1, sortedData.length)

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey)
    if (!column?.sortable && !sortable) return

    if (sortColumn === columnKey) {
      if (sortOrder === 'asc') {
        setSortOrder('desc')
      } else if (sortOrder === 'desc') {
        setSortOrder(null)
        setSortColumn(null)
      } else {
        setSortOrder('asc')
      }
    } else {
      setSortColumn(columnKey)
      setSortOrder('asc')
    }
  }

  const getCellValue = (row: T, column: TableColumn<T>) => {
    const value = typeof column.accessor === 'function' 
      ? column.accessor(row)
      : row[column.accessor]

    if (column.format) {
      return column.format(value, row)
    }

    return value
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) {
      return (
        <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      )
    }

    if (sortOrder === 'asc') {
      return (
        <svg className="w-4 h-4 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      )
    }

    if (sortOrder === 'desc') {
      return (
        <svg className="w-4 h-4 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )
    }

    return null
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const content = (
    <div className="space-y-4">
      {/* Search */}
      {searchable && (
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="max-w-sm"
          />
          {searchTerm && (
            <Badge variant="outline">
              {filteredData.length} result{filteredData.length === 1 ? '' : 's'}
            </Badge>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                      column.align === 'center' && "text-center",
                      column.align === 'right' && "text-right",
                      (column.sortable !== false && sortable) && "cursor-pointer hover:bg-gray-100",
                      column.className
                    )}
                    style={{ width: column.width }}
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center">
                      {column.header}
                      {(column.sortable !== false && sortable) && (
                        <SortIcon column={column.key} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-500">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    className={cn(
                      "hover:bg-gray-50 transition-colors",
                      onRowClick && "cursor-pointer",
                      rowClassName?.(row, index)
                    )}
                    onClick={() => onRowClick?.(row, index)}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          "px-4 py-3 whitespace-nowrap text-sm text-gray-900",
                          column.align === 'center' && "text-center",
                          column.align === 'right' && "text-right"
                        )}
                      >
                        {getCellValue(row, column)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex} to {endIndex} of {sortedData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber
                if (totalPages <= 5) {
                  pageNumber = i + 1
                } else if (currentPage <= 3) {
                  pageNumber = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i
                } else {
                  pageNumber = currentPage - 2 + i
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNumber}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  if (title || description) {
    return (
      <Card className={className}>
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    )
  }

  return <div className={className}>{content}</div>
}

// Specialized table for student rankings
export function StudentRankingTable({
  data,
  className,
  ...props
}: Omit<DataTableProps, 'columns'> & {
  data: Array<{
    rank: number
    name: string
    rollNumber: string
    totalMarks: number
    percentage: number
    grade: string
  }>
}) {
  const columns: TableColumn[] = [
    {
      key: 'rank',
      header: 'Rank',
      accessor: 'rank',
      align: 'center',
      width: '80px',
      format: (value) => (
        <Badge 
          variant={value <= 3 ? 'success' : value <= 10 ? 'info' : 'secondary'}
          className="font-mono"
        >
          #{value}
        </Badge>
      )
    },
    {
      key: 'name',
      header: 'Student Name',
      accessor: 'name',
      sortable: true
    },
    {
      key: 'rollNumber',
      header: 'Roll Number',
      accessor: 'rollNumber',
      align: 'center',
      width: '120px'
    },
    {
      key: 'totalMarks',
      header: 'Total Marks',
      accessor: 'totalMarks',
      align: 'right',
      width: '120px',
      sortable: true,
      format: (value) => formatNumber(value)
    },
    {
      key: 'percentage',
      header: 'Percentage',
      accessor: 'percentage',
      align: 'right',
      width: '120px',
      sortable: true,
      format: (value) => formatPercentage(value)
    },
    {
      key: 'grade',
      header: 'Grade',
      accessor: 'grade',
      align: 'center',
      width: '80px',
      format: (value) => (
        <Badge variant={
          value === 'A+' || value === 'A' ? 'success' :
          value === 'B' ? 'info' :
          value === 'C' ? 'warning' : 'destructive'
        }>
          {value}
        </Badge>
      )
    }
  ]

  return (
    <DataTable
      data={data}
      columns={columns}
      title="Student Rankings"
      description="Students ranked by overall performance"
      searchable
      className={className}
      {...props}
    />
  )
}
