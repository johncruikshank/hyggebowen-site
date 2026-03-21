import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import TheHomesPage from './pages/TheHomesPage'
import TheLandPage from './pages/TheLandPage'
import CommunityPage from './pages/CommunityPage'
import TheFilmPage from './pages/TheFilmPage'
import ConnectPage from './pages/ConnectPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-forest text-cream overflow-x-hidden">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/the-homes" element={<TheHomesPage />} />
            <Route path="/the-land" element={<TheLandPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/the-film" element={<TheFilmPage />} />
            <Route path="/connect" element={<ConnectPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
