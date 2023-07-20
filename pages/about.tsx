import BackGroundImage from '@/components/back_ground-image/BackGroundImage';
import React from 'react';
import styles from '../styles/about.module.scss';

const AboutPage = ({ isDark }: { isDark: boolean }) => {
  const { 
     container,
     welcomeText,
     welcomeTextWithHover
    } = styles;

  return (
    <div className={container}>
      <BackGroundImage  isDark={isDark}/>
      <div className={isDark ? welcomeText: welcomeTextWithHover }>
        <h3>Welcome to my About page!</h3>
        <p>
          I am dedicated to providing exceptional training in Next.js, the
          cutting-edge JavaScript framework. This project is built solely by me
          to help you master Next.js development. With the rising demand for
          Next.js, I recognized the need for a comprehensive training platform.
          My mission is to empower individuals with the skills needed to excel
          in Next.js. My training program caters to beginners and experienced
          developers. I provide high-quality instruction and guidance throughout
          your learning journey.
        </p>
        <p>
          Join my program to connect with a vibrant community of learners.
          Collaborate on projects and access support channels for a supportive
          learning environment. Emphasizing hands-on practice, my program
          includes real-world projects to enhance your skills and showcase your
          capabilities. Education should be accessible and flexible, so my
          program is available anytime, anywhere.
        </p>
        <p>
          Ready to take your Next.js skills to the next level? Join me on this
          transformative learning journey. Lets unleash your web development
          potential!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
