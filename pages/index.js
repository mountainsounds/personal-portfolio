import BaseLayout from '@/components/layouts/BaseLayout';
import HomePage from '@/components/HomePage';



export default function Home() {
  return (
    <>
      <BaseLayout page='home'>
        <HomePage />
      </BaseLayout>
    </>
  )
}
