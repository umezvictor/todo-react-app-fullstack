import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Nabvar'

function App() {

  //Make sure Outlet is included to render child routes properly.
  //this will be referenced by every page to render the navbar
  //don't add another component here, it will display, but break other pages
  return (
      <div>
        <Navbar />      
         <Outlet />   
      </div>
  )
}

export default App
