'use client'

import { useRouter } from "next/navigation"
import { TableCell, TableRow } from "@/components/ui/table"

interface ProposalRowProps {
  number: string
  title: string
  authors: string
  category: string
  type: string
  status: string
  created: string
}

export function ProposalRow({
  number,
  title,
  authors,
  category,
  type,
  status,
  created,
}: ProposalRowProps) {
  const router = useRouter()

  return (
    <TableRow 
      className="h-16 hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={() => router.push(`/solana/proposals/${number}`)}
    >
      <TableCell className="py-4">#{number}</TableCell>
      <TableCell className="py-4">{title}</TableCell>
      <TableCell className="py-4">{authors}</TableCell>
      <TableCell className="py-4">{category}</TableCell>
      <TableCell className="py-4">{type}</TableCell>
      <TableCell className="py-4">{status}</TableCell>
      <TableCell className="py-4">{created}</TableCell>
    </TableRow>
  )
} 