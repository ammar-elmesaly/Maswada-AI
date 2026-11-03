import { BrowserRouter, Routes, Route } from "react-router-dom"

import { AppLayout } from "@/app/layout/AppLayout"
import { HomePage } from "@/app/pages/HomePage"
import { NotFoundPage } from "@/app/pages/NotFoundPage"
import { SignInPage } from "./pages/SignInPage"
import { SignUpPage } from "./pages/SignUpPage"
import { NotesDetailsPage } from "./pages/NoteDetailsPage"
import { ProtectedRoute } from "@/components/common/ProtectedRoute"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/" element={<HomePage />} />
          <Route path="/notes/:id" element={<NotesDetailsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
