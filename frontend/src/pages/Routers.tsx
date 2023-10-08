import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageLayout from "~/components/PageLayout";
import pages from "~/pages";

const Routers = () => (
  <BrowserRouter>
    <PageLayout>
      <Routes>
        {Object.values(pages).map(({ path, Component }, i) => (
          <Route key={i} path={path} element={<Component />} />
        ))}
      </Routes>
    </PageLayout>
  </BrowserRouter>
);

export default Routers;
