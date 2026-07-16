import { SiteHeader } from '../_components/SiteHeader'
import { SiteFooter } from '../_components/SiteFooter'

export default function LayoutC({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white" style={{ wordBreak: 'keep-all' }}>
      <SiteHeader variant="c" base="/hanil/c" />
      <main>{children}</main>
      <SiteFooter variant="c" base="/hanil/c" />
    </div>
  )
}
