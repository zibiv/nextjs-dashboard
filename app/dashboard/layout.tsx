import { FC } from 'react'
import SideNav from '@/app/ui/dashboard/sidenav'

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({children}) => {
 
  return (
  // общий контейнер
  <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
    {/* боковое меню */}
    <div className='w-full flex-none md:w-64'>
      <SideNav />
    </div>
    {/* контент */}
    <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
  </div>
  )
}

export default Layout