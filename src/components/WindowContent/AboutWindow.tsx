'use client';

import Image from 'next/image';
import './WindowContent.scss';

export function AboutWindow() {
  return (
    <div className="window-content about-window">
      <div className="about-window__hero">
        <div className="about-window__avatar">
          <Image
            src="/desktop-icons/me.png"
            alt="Diego"
            width={96}
            height={96}
            className="about-window__avatar-img"
          />
        </div>
        <div className="about-window__intro">
          <h2 className="about-window__name">Diego</h2>
          <p className="about-window__tagline">
            Software Engineer & Creator
          </p>
          <div className="about-window__stats">
            <span className="about-window__stat">
              <span className="about-window__stat-icon">{'</>'}</span>
              Full-Stack Dev
            </span>
            <span className="about-window__stat">
              <span className="about-window__stat-icon">{'~'}</span>
              Building in Public
            </span>
          </div>
        </div>
      </div>

      <div className="about-window__content">
        <section className="about-window__section">
          <h3>The Quest</h3>
          <p>
            Welcome, adventurer! I&apos;m Diego, a software engineer who believes
            learning should feel like leveling up in your favorite RPG. This space
            is where I document my journey through the realms of code, product
            building, and personal growth.
          </p>
        </section>

        <section className="about-window__section">
          <h3>Current Class</h3>
          <ul className="about-window__list">
            <li>
              <strong>Main:</strong> Full-Stack Engineer crafting web experiences
            </li>
            <li>
              <strong>Side Quest:</strong> Building SaaS products and sharing the journey
            </li>
            <li>
              <strong>Passive Skill:</strong> Turning complex topics into digestible content
            </li>
          </ul>
        </section>

        <section className="about-window__section">
          <h3>Skill Tree</h3>
          <div className="about-window__skills">
            <span className="about-window__skill">TypeScript</span>
            <span className="about-window__skill">React</span>
            <span className="about-window__skill">Next.js</span>
            <span className="about-window__skill">Node.js</span>
            <span className="about-window__skill">Python</span>
            <span className="about-window__skill">PostgreSQL</span>
          </div>
        </section>

        <section className="about-window__section">
          <h3>What You&apos;ll Find Here</h3>
          <ul className="about-window__list">
            <li>
              <strong>Journal Entries:</strong> Technical deep-dives and tutorials
            </li>
            <li>
              <strong>Quest Log:</strong> Interactive challenges to test your skills
            </li>
            <li>
              <strong>Inventory:</strong> Collectible items earned through learning
            </li>
          </ul>
        </section>

        <section className="about-window__section about-window__section--cta">
          <p>
            Ready to start your adventure? Create an account to track your XP,
            complete quests, and collect rare items along the way.
          </p>
        </section>
      </div>
    </div>
  );
}
