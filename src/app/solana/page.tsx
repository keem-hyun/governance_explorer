import { Suspense } from 'react'
import { Connection } from '@solana/web3.js'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EpochSkeleton } from '@/components/skeletons/epoch-skeleton'

const SLOT_TIME_MS = 400

async function EpochInfo() {
  const connection = new Connection(
    process.env.SOLANA_RPC_URL ?? ''
  )
  
  const epochInfo = await connection.getEpochInfo();
  const progress = (epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100;
  const remainingSlots = epochInfo.slotsInEpoch - epochInfo.slotIndex;
  const remainingTimeMs = remainingSlots * SLOT_TIME_MS;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Epoch {epochInfo.epoch}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={progress} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-2xl font-bold">{progress.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining Time</p>
              <p className="text-2xl font-bold">
                {Math.floor(remainingTimeMs / 1000 / 60)} minutes
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <Suspense fallback={<EpochSkeleton />}>
        <EpochInfo />
      </Suspense>
    
    </div>
  )
}