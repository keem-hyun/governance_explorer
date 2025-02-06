'use client'

import { Card } from "@/components/ui/card"
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table"

export function ProposalList() {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Votes</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Example Proposal</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>100</TableCell>
            <TableCell>2024-03-21</TableCell>
          </TableRow>
          {/* More rows will be added with real data */}
        </TableBody>
      </Table>
    </Card>
  )
} 