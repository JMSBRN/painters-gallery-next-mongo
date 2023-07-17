import Image from 'next/image';
import React from 'react';
import styles from '../styles/home.module.scss';
import yachtImage from '../public/svgs/yacht.svg';

const Home = ({ isDark }: { isDark: boolean }) => {
  const { mainContainer, welcomeBlock, secondTitlesContainer, boat } = styles;

  return (
    <div className={mainContainer}>
      { !isDark && (
        <div style={{ width: `${Math.random() * (100 + 1)}%` }} className={boat}>
          <Image src={yachtImage} width={20} alt="yacht" />
        </div>
      )}
      <div className={welcomeBlock}>
        <h1>Welcome to the Painters Gallery!</h1>
        <div className={secondTitlesContainer}>
          <p>
            Immerse yourself in a world of vibrant colors, captivating
            brushstrokes, and artistic expression. Our gallery is a haven for
            art enthusiasts and a platform that celebrates the talent and
            creativity of painters from around the globe.
          </p>
          <p>
            Step into a realm where imagination takes form on canvas, where
            every stroke tells a story, and where emotions are translated into
            breathtaking visual masterpieces. From classic landscapes to
            abstract marvels, our diverse collection showcases a rich tapestry
            of artistic styles and techniques.
          </p>
          <p>
            As you wander through our gallery, allow the brushstrokes to guide
            you on a journey of exploration and introspection. Each painting
            whispers its own narrative, inviting you to pause, reflect, and
            connect with the artists vision.
          </p>
          <p>
            Whether you are a seasoned collector, an aspiring artist, or simply
            a lover of beauty, our gallery offers a sanctuary for inspiration
            and contemplation. Discover new talents and established masters,
            each with their own unique voice and perspective,
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
