'use client'

import { useEffect, useRef } from 'react'

const REPO = process.env.NEXT_PUBLIC_UTTERANCES_REPO ?? ''

export const Utterances = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!REPO || !container) return

    const script = document.createElement('script')
    script.src = 'https://utteranc.es/client.js'
    script.setAttribute('repo', REPO)
    script.setAttribute('issue-term', 'url')
    script.setAttribute('theme', 'github-light')
    script.crossOrigin = 'anonymous'
    script.async = true
    container.appendChild(script)

    return () => {
      container.replaceChildren()
    }
  }, [])

  if (!REPO) {
    return null
  }

  return (
    <section className="mt-[48px] pt-[32px] border-t border-[#E7E7E7]" aria-label="Comments">
      <div ref={containerRef} />
    </section>
  )
}
