import Header from '@/components/shared/Header';
import AsideNav from '@/components/shared/AsideNav';

const BaseLayout = props => {
  const {className, children, page} = props;

  return (
    <div className='body' id={`body-${page}`}>
      <AsideNav page={page} />
      <main>
        <Header page={page} />
        { children }
      </main>
  </div>
  )
}

export default BaseLayout;
