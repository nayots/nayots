import React from "react";
import styles from "./splash.module.scss";

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
            <p>
              If you wanna get in touch or learn more about me, check me out
              using the links below.
            </p>
          </p>
        </section>
      </article>
    </React.Fragment>
  );
};

export default Splash;
