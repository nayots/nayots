import React from "react";
import styles from "./splash.module.scss";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export const Splash: React.FC<{}> = (props): JSX.Element => {
  return (
    <React.Fragment>
      <article className={styles.splashRoot}>
        <section>
          <p>
            Hi there, you found me.{" "}
            <span role="img" aria-label="hi">
              🙂
            </span>
          </p>
          <p>My name is Stoyan Grigorov</p>
          <p>
            I'm a software developer based in Sofia, Bulgaria. I have serious
            passion about working on cool projects, learning and solving
            problems mostly with .NET, Javascript, Typescript, React and more.
          </p>
          <p>
            If you wanna get in touch or learn more about me, check me out using
            the links below.
          </p>
          <p className={styles.links}>
            <a
              title="Nayots GitHub"
              href="https://github.com/nayots"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a
              title="LinkedIn"
              href="https://www.linkedin.com/in/grigorov-stoyan/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a href="mailto: grigorov.stoyan@gmail.com?subject=Hi Stoyan">
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          </p>
        </section>
      </article>
    </React.Fragment>
  );
};

export default Splash;
