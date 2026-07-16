import { SiteHeader } from '../_components/SiteHeader'
import { SiteFooter } from '../_components/SiteFooter'

export default function LayoutB({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white" style={{ wordBreak: 'keep-all' }}>
      <SiteHeader variant="b" base="/hanil/b" />
      <main>{children}</main>
      <SiteFooter variant="b" base="/hanil/b" />
    </div>
  )
}
