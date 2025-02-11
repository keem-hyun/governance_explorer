import { fetchGithubProposals } from "@/util/useGithub"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateStaticParams() {
  const proposals = await fetchGithubProposals()
  return proposals.map((proposal) => ({
    id: proposal.name.match(/^(\d+)-/)?.[1] || ''
  }))
}

export default async function ProposalsPage() {
  const proposals = await fetchGithubProposals()

  return (
    <div className="container py-8 ml-8">
      <h1 className="text-3xl font-bold mb-8">Solana Improvement Proposals</h1>
      
      <div className="rounded-md border">
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
            {proposals.map((proposal) => {
              const match = proposal.name.match(/^(\d+)-(.+)\.md$/)
              const number = match?.[1] || ''
              const title = match?.[2]?.replace(/-/g, ' ') || proposal.name
              
              // Markdown 내용에서 메타데이터 파싱
              const authors = proposal.content.match(/authors?:\s*(.+)/i)?.[1] || '-'
              const category = proposal.content.match(/category:\s*(.+)/i)?.[1] || '-'
              const type = proposal.content.match(/type:\s*(.+)/i)?.[1] || '-'
              const status = proposal.content.match(/status:\s*(.+)/i)?.[1] || '-'
              const created = proposal.content.match(/created:\s*(.+)/i)?.[1] || '-'

              return (
                <ProposalRow 
                  key={proposal.name} 
                  number={number} 
                  title={title} 
                  authors={authors} 
                  category={category} 
                  type={type} 
                  status={status} 
                  created={created}
                />
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function ProposalRow({ 
  number, 
  title, 
  authors, 
  category, 
  type, 
  status, 
  created 
}: {
  number: string
  title: string
  authors: string
  category: string
  type: string
  status: string
  created: string
}) {
  return (
    <TableRow className="h-16 cursor-pointer hover:bg-muted/50 transition-colors">
      <TableCell className="py-4">
        <Link 
          href={`/solana/proposals/${number}`}
          className="block h-full w-full"
        >
          #{number}
        </Link>
      </TableCell>
      <TableCell className="py-4">
        <Link 
          href={`/solana/proposals/${number}`}
          className="block h-full w-full"
        >
          {title}
        </Link>
      </TableCell>
      <TableCell className="py-4">
        <Link 
          href={`/solana/proposals/${number}`}
          className="block h-full w-full"
        >
          {authors}
        </Link>
      </TableCell>
      <TableCell className="py-4">
        <Link 
          href={`/solana/proposals/${number}`}
          className="block h-full w-full"
        >
          {category}
        </Link>
      </TableCell>
      <TableCell className="py-4">
        <Link 
          href={`/solana/proposals/${number}`}
          className="block h-full w-full"
        >
          {type}
        </Link>
      </TableCell>
      <TableCell className="py-4">
        <Link 
          href={`/solana/proposals/${number}`}
          className="block h-full w-full"
        >
          {status}
        </Link>
      </TableCell>
      <TableCell className="py-4">
        <Link 
          href={`/solana/proposals/${number}`}
          className="block h-full w-full"
        >
          {created}
        </Link>
      </TableCell>
    </TableRow>
  )
} 