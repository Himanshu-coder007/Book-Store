// App.js
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import BookDetails from './pages/BookDetails'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/:id" element={<BookDetails />} />
      </Routes>
    </Router>
  )
}

export default App;