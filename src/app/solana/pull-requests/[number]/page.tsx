import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { fetchGithubPullRequest } from '@/util/useGithub'
import { PullRequestDetailSkeleton } from '@/components/skeletons/pull-request-detail-skeleton'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import type { Comment, PullRequestDetail } from '@/types/githubPullRequest'

async function PullRequestDetail({ number }: { number: number }) {
  const pr = await fetchGithubPullRequest(number) as PullRequestDetail;

  if (!pr) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* PR 헤더 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant={pr.state === 'OPEN' ? 'default' : 'secondary'}>
              {pr.state}
            </Badge>
            <CardTitle>#{pr.number} {pr.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Image 
              src={pr.author.avatarUrl} 
              alt={pr.author.login}
              width={20}
              height={20}
              className="rounded-full"
            />
            <span>{pr.author.login}</span>
            <span>opened on {new Date(pr.createdAt).toLocaleDateString()}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-sm">
              <div className="font-medium">Comments</div>
              <div>{pr.comments.totalCount}</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Commits</div>
              <div>{pr.commits.totalCount}</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Changed Files</div>
              <div>{pr.changedFiles}</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Lines</div>
              <div>+{pr.additions} -{pr.deletions}</div>
            </div>
          </div>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {pr.body}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>Comments ({pr.comments.totalCount})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {pr.comments.nodes.map((comment: Comment) => (
              <div key={comment.id} className="border-t pt-6 first:border-t-0 first:pt-0">
                <div className="flex items-center gap-2 mb-2">
                  <Image 
                    src={comment.author.avatarUrl} 
                    alt={comment.author.login}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="font-medium">{comment.author.login}</span>
                  <span className="text-sm text-muted-foreground">
                    commented on {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {comment.body}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PullRequestPage({
  params
}: {
  params: { number: string }
}) {
  return (
    <Suspense fallback={<PullRequestDetailSkeleton />}>
      <PullRequestDetail number={parseInt(params.number)} />
    </Suspense>
  )
} 