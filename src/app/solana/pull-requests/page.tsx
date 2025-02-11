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

export const dynamic = 'force-static'
export const revalidate = 3600

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
                <PaginationPrevious 
                  href={`/solana/pull-requests?page=${page > 1 ? page - 1 : 1}`}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                if (pageNum > 0 && pageNum <= totalPages) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href={`/solana/pull-requests?page=${pageNum}`}
                        isActive={pageNum === page}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })}
              {totalPages > 5 && page < totalPages - 2 && (
                <>
                  <PaginationItem>
                    <span className="px-2">...</span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href={`/solana/pull-requests?page=${totalPages}`}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              <PaginationItem>
                <PaginationNext 
                  href={`/solana/pull-requests?page=${page < totalPages ? page + 1 : totalPages}`}
                  className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                />
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