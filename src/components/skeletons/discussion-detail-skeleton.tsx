import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function CommentSkeleton({ isReply = false }: { isReply?: boolean }) {
  return (
    <div className={`${isReply ? 'ml-12 border-l pl-6' : 'border-t pt-6'}`}>
      <div className="flex items-start gap-3">
        <Skeleton className={`${isReply ? 'h-8 w-8' : 'h-10 w-10'} rounded-full`} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function DiscussionDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Discussion Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-8 w-[400px]" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-6 w-[100px] rounded-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-[150px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <CommentSkeleton key={i} />
            ))}
            {/* 대댓글 예시 */}
            <CommentSkeleton isReply />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 