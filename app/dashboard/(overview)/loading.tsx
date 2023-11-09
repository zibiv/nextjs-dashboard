import { FC } from 'react'
import DashboardSkeleton from '@/app/ui/skeletons';
interface LoadingProps {
  
}

const Loading: FC<LoadingProps> = ({}) => {
  return <DashboardSkeleton />
}

export default Loading