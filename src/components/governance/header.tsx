interface GovernanceHeaderProps {
  chain: string
}

export function GovernanceHeader({ chain }: GovernanceHeaderProps) {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">{chain}</h1>
    </div>
  )
} 