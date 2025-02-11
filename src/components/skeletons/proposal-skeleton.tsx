import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

function ProposalRowSkeleton() {
  return (
    <TableRow className="h-16">
      <TableCell className="py-4">
        <Skeleton className="h-4 w-12" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-[250px]" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-[180px]" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="py-4">
        <Skeleton className="h-4 w-24" />
      </TableCell>
    </TableRow>
  )
}

export function ProposalsSkeleton() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-[400px] mb-8" />
      
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-12">SIMD</TableHead>
                <TableHead className="w-[300px] h-12">Title</TableHead>
                <TableHead className="h-12">Authors</TableHead>
                <TableHead className="h-12">Category</TableHead>
                <TableHead className="h-12">Type</TableHead>
                <TableHead className="h-12">Status</TableHead>
                <TableHead className="h-12">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <ProposalRowSkeleton key={i} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export function ProposalDetailSkeleton() {
  return (
    <div className="container py-8">
      <Card>
        <CardContent className="space-y-6">
          {/* 프론트매터 스켈레톤 */}
          <div className="p-4 bg-muted/50 rounded-md space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-[60%]" />
            ))}
          </div>

          {/* 본문 스켈레톤 */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-[80%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-8 w-[70%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 