import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { fetchGithubDiscussions } from '@/util/useGithub'
import { type DiscussionNode } from '@/types/githubDiscussion'
import { DiscussionsSkeleton } from '@/components/skeletons/discussion-skeleton'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-static'
export const revalidate = 3600

function DiscussionItem({ discussion }: { discussion: DiscussionNode }) {
  return (
    <div className="border-b pb-4 hover:bg-muted/50 p-4 rounded-lg">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-semibold">
            <Link 
              href={`/solana/discussions/${discussion.number}`}
              className="hover:text-primary"
            >
              #{discussion.number} {discussion.title}
            </Link>
          </h3>
          <div className="flex items-center gap-2">
            <Image 
              src={discussion.author.avatarUrl} 
              alt={discussion.author.login}
              width={20}
              height={20}
              className="rounded-full"
            />
            <span className="text-sm text-muted-foreground">
              {discussion.author.login}
            </span>
          </div>
        </div>
        <Badge variant="secondary">
          {discussion.category.name}
        </Badge>
      </div>
      
      <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {discussion.comments.totalCount}
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          {discussion.reactions.totalCount}
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {new Date(discussion.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}

async function DiscussionsList() {
  const discussions = await fetchGithubDiscussions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solana Improvement Proposals in GitHub Discussions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <DiscussionItem key={discussion.number} discussion={discussion} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DiscussionsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <Suspense fallback={<DiscussionsSkeleton />}>
        <DiscussionsList />
      </Suspense>
    </div>
  )
} 