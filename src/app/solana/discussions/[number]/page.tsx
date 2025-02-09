import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { fetchGithubDiscussion } from '@/util/useGithub'
import { DiscussionDetailSkeleton } from '@/components/skeletons/discussion-detail-skeleton'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Comment } from '@/types/githubDiscussion'

function CommentItem({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) {
  return (
    <div className={`${isReply ? 'ml-12 border-l pl-6' : 'border-t pt-6'}`}>
      <div className="flex items-start gap-3">
        <Image 
          src={comment.author.avatarUrl} 
          alt={comment.author.login}
          width={isReply ? 32 : 40}
          height={isReply ? 32 : 40}
          className="rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{comment.author.login}</span>
            <span className="text-sm text-muted-foreground">
              commented on {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="prose dark:prose-invert max-w-none [&>*]:mb-4 [&>p]:leading-7">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              className="markdown-body space-y-4"
            >
              {comment.body}
            </ReactMarkdown>
          </div>
        </div>
      </div>
      
      {/* 대댓글 표시 */}
      {comment.replies?.nodes?.length > 0 && (
        <div className="space-y-6 mt-6">
          {comment.replies.nodes.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  )
}

async function DiscussionDetail({ number }: { number: number }) {
  const discussion = await fetchGithubDiscussion(number)

  if (!discussion) {
    return <div>Discussion not found</div>
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>#{discussion.number} {discussion.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Image 
                  src={discussion.author.avatarUrl} 
                  alt={discussion.author.login}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="text-sm text-muted-foreground">
                  {discussion.author.login}
                </span>
                <span className="text-sm text-muted-foreground">
                  opened on {new Date(discussion.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Badge variant="secondary">
              {discussion.category.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none [&>*]:mb-4 [&>p]:leading-7">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              className="markdown-body space-y-4"
            >
              {discussion.body}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>Comments ({discussion.comments.nodes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {discussion.comments.nodes.map((comment: Comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DiscussionDetailPage({
  params
}: {
  params: { number: string }
}) {
  return (
    <Suspense fallback={<DiscussionDetailSkeleton />}>
      <DiscussionDetail number={parseInt(params.number)} />
    </Suspense>
  )
} 