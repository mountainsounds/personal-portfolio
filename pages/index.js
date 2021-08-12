import BaseLayout from '@/components/layouts/BaseLayout';
import HomePage from '@/components/HomePage';
import { useRouter } from 'next/router';



export default function Home() {
  const router = useRouter();

  return (
    <>
      <BaseLayout page='home'>
        <HomePage />
      </BaseLayout>
    </>
  )
}
