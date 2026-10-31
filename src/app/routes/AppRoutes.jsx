import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import BoardPage from "../../features/board/ui/pages/BoardPage";
import ListPage from "../../features/board/ui/pages/ListPage";
import NotFound from "../../shared/ui/pages/NotFound";
import AppLayout from "../layouts/AppLayout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/board" replace />} />
        <Route element={<AppLayout />}>
          <Route path="/board" element={<BoardPage />} />
          <Route path="/list" element={<ListPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
