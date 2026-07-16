import { SiteHeader } from '../_components/SiteHeader'
import { SiteFooter } from '../_components/SiteFooter'

export default function LayoutA({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0B1B33]" style={{ wordBreak: 'keep-all' }}>
      <SiteHeader variant="a" base="/hanil/a" />
      <main>{children}</main>
      <SiteFooter variant="a" base="/hanil/a" />
    </div>
  )
}
