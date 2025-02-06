'use client'

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export function HomePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80" />
      

      <div className="relative flex flex-col items-center justify-center min-h-screen z-10">
        {/* Ethereum logo with 3D rotation and link */}
        <div className="perspective-[1000px]">
          <Link href="/ethereum">
            <motion.div
              className="relative w-32 h-32 mb-8 [transform-style:preserve-3d] cursor-pointer"
              animate={{ 
                rotateY: 360,
                rotateX: [0, 30, 0, -30, 0],
              }}
              transition={{ 
                rotateY: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                },
                rotateX: {
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              whileHover={{ 
                scale: 1.1,
                filter: "brightness(1.2)"
              }}
            >
              <Image
                src="/chains/ethereum.svg"
                alt="Ethereum Governance"
                fill
                className="object-contain"
              />
            </motion.div>
          </Link>
        </div>

        <h1 className="text-6xl font-bold mb-4">GovScan</h1>
        <p className="text-xl text-muted-foreground text-center max-w-2xl">
          Explore and analyze on-chain governance activities across multiple networks
        </p>
      </div>
    </div>
  )
}