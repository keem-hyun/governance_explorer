import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { fetchGithubPullRequests } from '@/util/useGithub'
import { PullRequestsSkeleton } from '@/components/skeletons/pull-requests-skeleton'
import Image from 'next/image'
import Link from 'next/link'
import { PullRequest } from '@/types/githubPullRequest'
import { PaginatedPageProps } from '@/types/pageProps'

export const dynamic = 'force-dynamic'

async function PullRequestsList({ page }: { page: number }) {
  const { nodes: prs, totalCount } = await fetchGithubPullRequests(page);
  const totalPages = Math.ceil(totalCount / 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solana Improvement Proposals in GitHub Pull Requests ({totalCount})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Number</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Labels</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="text-right">Commits</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prs.map((pr: PullRequest) => (
              <TableRow key={pr.number}>
                <TableCell>#{pr.number}</TableCell>
                <TableCell>
                  <Link 
                    href={`/solana/pull-requests/${pr.number}`}
                    className="hover:text-primary"
                  >
                    {pr.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image 
                      src={pr.author.avatarUrl} 
                      alt={pr.author.login}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span>{pr.author.login}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {pr.labels.nodes.map((label) => (
                      <Badge 
                        key={label.name}
                        style={{ 
                          backgroundColor: `#${label.color}`,
                          color: parseInt(label.color, 16) > 0x7FFFFF ? '#000' : '#fff'
                        }}
                      >
                        {label.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">{pr.comments.totalCount}</TableCell>
                <TableCell className="text-right">{pr.commits.totalCount}</TableCell>
                <TableCell className="text-right">
                  {new Date(pr.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Link 
                  href={`/solana/pull-requests?page=${Math.max(1, page - 1)}`}
                  legacyBehavior
                >
                  <PaginationPrevious />
                </Link>
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                
                return (
                  <PaginationItem key={pageNum}>
                    <Link 
                      href={`/solana/pull-requests?page=${pageNum}`}
                      legacyBehavior
                    >
                      <PaginationLink isActive={pageNum === page}>
                        {pageNum}
                      </PaginationLink>
                    </Link>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <Link 
                  href={`/solana/pull-requests?page=${Math.min(totalPages, page + 1)}`}
                  legacyBehavior
                >
                  <PaginationNext />
                </Link>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function PullRequestsPage({
  searchParams
}: PaginatedPageProps) {
  const params = await searchParams
  const page = params.page ? parseInt(params.page) : 1

  return (
    <div className="flex flex-col gap-6 p-6">
      <Suspense fallback={<PullRequestsSkeleton />}>
        <PullRequestsList page={page} />
      </Suspense>
    </div>
  )
}