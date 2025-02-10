import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { fetchGithubPullRequest, fetchPullRequestDiff, fetchFileContent } from '@/util/useGithub'
import { PullRequestDetailSkeleton } from '@/components/skeletons/pull-request-detail-skeleton'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import type { Comment, PullRequestDetail, PullRequestFile, Review, ReviewThread } from '@/types/githubPullRequest'
import { PageProps } from '@/types/pageProps'

async function PullRequestDetail({ params }: { params: { number: string } }) {
  const pr = await fetchGithubPullRequest(parseInt(params.number));
  const diffFiles = await fetchPullRequestDiff(parseInt(params.number));

  // 파일 내용을 저장할 객체
  const fileContents: { [key: string]: string } = {};

  // 리뷰 스레드에서 언급된 모든 파일의 내용을 가져옵니다
  for (const thread of pr.reviewThreads.nodes) {
    if (!fileContents[thread.path]) {
      // 기본적으로 base 버전의 파일을 가져옵니다
      const content = await fetchFileContent(thread.path, pr.baseRefOid);
      if (content) {
        fileContents[thread.path] = content;
      }
    }
  }

  console.log('File contents loaded:', Object.keys(fileContents));

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
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* PR 설명 */}
            <div className="border-b pb-6">
              <div className="flex items-center gap-2 mb-2">
                <Image 
                  src={pr.author.avatarUrl} 
                  alt={pr.author.login}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="font-medium">{pr.author.login}</span>
                <span className="text-sm text-muted-foreground">
                  commented on {new Date(pr.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {pr.body}
                </ReactMarkdown>
              </div>
            </div>

            {/* 일반 댓글 */}
            {pr.comments.nodes.map((comment: Comment) => (
              <div key={comment.id} className="border-t pt-6">
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

            {/* 파일 리뷰 스레드 */}
            {pr.reviewThreads.nodes.map((thread: ReviewThread) => {
              // 라인 범위 계산
              const getLineRange = () => {
                // Case 1: line이 null이고 originalLine이 있는 경우 (삭제된 라인)
                if (thread.line === null && thread.originalLine) {
                  return {
                    start: thread.originalLine - 2,  // originalLine - 1 에서 시작
                    end: thread.originalLine,        // originalLine까지
                    displayStart: thread.originalLine - 1,
                    displayEnd: thread.originalLine
                  };
                }
                
                // Case 2: line과 originalLine이 같은 경우
                if (thread.line && thread.line === thread.originalLine) {
                  return {
                    start: thread.line - 2,         // line - 1 에서 시작
                    end: thread.line,               // line까지
                    displayStart: thread.line - 1,
                    displayEnd: thread.line
                  };
                }

                // Case 3: line과 originalLine이 다른 경우
                if (thread.line && thread.originalLine) {
                  return {
                    start: thread.originalLine - 4,  // originalLine - 3 에서 시작
                    end: thread.originalLine,        // originalLine까지
                    displayStart: thread.originalLine - 3,
                    displayEnd: thread.originalLine
                  };
                }

                return null;
              };

              const range = getLineRange();
              
              console.log('Thread info:', {
                path: thread.path,
                line: thread.line,
                originalLine: thread.originalLine,
                range,
                hasContent: Boolean(fileContents[thread.path])
              });

              if (!range) return null;

              const content = fileContents[thread.path];
              if (!content) return null;

              const lines = content.split('\n')
                .slice(range.start, range.end)
                .filter(Boolean);

              return (
                <div key={thread.id} className="border-t pt-6">
                  <div className="ml-6 mb-4">
                    <div className="bg-muted rounded-md overflow-hidden mb-4">
                      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                        <span className="font-mono text-sm">{thread.path}</span>
                        <span className="text-sm text-muted-foreground">
                          Lines {range.displayStart}-{range.displayEnd}
                        </span>
                      </div>
                      <div className="p-4 overflow-x-auto">
                        <pre className="text-sm">
                          {lines.map((line, i) => (
                            <div key={i} className="px-2">
                              <span className="select-none text-muted-foreground mr-4 inline-block w-10 text-right">
                                {range.displayStart + i}
                              </span>
                              {line}
                            </div>
                          ))}
                        </pre>
                      </div>
                    </div>

                    {/* 댓글 표시 */}
                    {thread.comments.nodes.map((comment: Comment) => (
                      <div key={comment.id} className="border-l-2 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Image 
                            src={comment.author.avatarUrl} 
                            alt={comment.author.login}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span className="font-medium">{comment.author.login}</span>
                          {comment.pullRequestReview && (
                            <Badge variant="outline">{comment.pullRequestReview.state}</Badge>
                          )}
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
                </div>
              );
            })}

            {/* 리뷰 댓글 */}
            {pr.reviews.nodes.map((review: Review) => (
              <div key={review.id}>
                {review.body && (
                  <div className="border-t pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Image 
                        src={review.author.avatarUrl} 
                        alt={review.author.login}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="font-medium">{review.author.login}</span>
                      <Badge variant="outline">{review.state}</Badge>
                      <span className="text-sm text-muted-foreground">
                        reviewed on {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                      >
                        {review.body}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* 파일 리뷰 댓글 */}
                {review.comments.nodes.map((comment) => (
                  <div key={comment.id} className="border-t pt-6 ml-6">
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
                        commented on file {comment.path}
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
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 변경된 파일 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>Changed Files ({pr.changedFiles})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {diffFiles.map((file: PullRequestFile) => (
              <div key={file.filename} className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{file.filename}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-500">+{file.additions}</span>
                    <span className="text-red-500">-{file.deletions}</span>
                  </div>
                </div>

                {/* Diff 표시 */}
                <div className="bg-muted rounded-md overflow-hidden">
                  <pre className="p-4 text-sm overflow-x-auto whitespace-pre-wrap">
                    {file.patch?.split('\n').map((line, i) => {
                      let lineClass = 'block';
                      if (line.startsWith('+')) {
                        lineClass += ' bg-green-950 text-green-400';
                      } else if (line.startsWith('-')) {
                        lineClass += ' bg-red-950 text-red-400';
                      } else if (line.startsWith('@@ ')) {
                        lineClass += ' text-blue-400';
                      }
                      return (
                        <span key={i} className={lineClass}>
                          {line}
                        </span>
                      );
                    })}
                  </pre>
                </div>
                
                {/* 파일에 대한 리뷰 댓글들 */}
                {pr.reviews.nodes.flatMap((review: Review) => 
                  review.comments.nodes
                    .filter(comment => comment.path === file.filename)
                    .map(comment => (
                      <div key={comment.id} className="ml-6 border-l-2 pl-4 py-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Image 
                            src={comment.author.avatarUrl} 
                            alt={comment.author.login}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span className="font-medium">{comment.author.login}</span>
                          <Badge variant="outline">{comment.pullRequestReview.state}</Badge>
                          {comment.line && (
                            <span className="text-sm text-muted-foreground">
                              on line {comment.line}
                            </span>
                          )}
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
                    ))
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default async function PullRequestPage({ params }: PageProps) {
  const { number } = await params

  return (
    <Suspense fallback={<PullRequestDetailSkeleton />}>
      <PullRequestDetail params={{ number }} />
    </Suspense>
  )
}