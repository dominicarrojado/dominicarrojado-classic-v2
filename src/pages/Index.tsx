import './Index.css';

import Hero from '../components/Hero';
import AboutMe from '../components/AboutMe';
import Works from '../components/Works';
import Footer from '../components/Footer';

function Index() {
  return (
    <div className="page-index">
      <Hero />
      <AboutMe />
      <Works />
      <Footer />
    </div>
  );
}

export default Index;
