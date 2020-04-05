import React from "react";
import Layout from "./components/layout/layout";
import { Splash } from "./components/splash/splash";

export const App: React.FC<{}> = (props): JSX.Element => {
  return (
    <React.Fragment>
      <Layout>
        <Splash />
      </Layout>
    </React.Fragment>
  );
};

export default App;
