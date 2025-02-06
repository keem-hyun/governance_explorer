import { GovernanceStats } from "@/components/governance/stats"
import { ProposalList } from "@/components/governance/proposal-list"
import { GovernanceHeader } from "@/components/governance/header"

export default function EthereumGovernancePage() {
  return (
    <div className="flex flex-col gap-6 mt-10">
      <GovernanceHeader chain="Ethereum" />
      
      <GovernanceStats />
      
      <ProposalList />
    </div>
  )
}