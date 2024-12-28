import { BrowserRouter,Route,Routes } from "react-router-dom"
import Header from "./component/Header"
import ScrollToTop from "./component/ScrollToTop"
import Footer from "./component/Footer"
import Helper from "./component/Helper"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import About from "./pages/About"
import SignIn from "./pages/SignIn"
import PrivateRoute from "./component/PrivateRoute"
import SignUp from "./pages/SignUp"
import OnlyAdminPrivateRoute from "./component/OnlyAdminPrivateRoute"
import ContactUs from "./pages/ContactUs"
import CreateLead from "./pages/CreateLead"
import LeadPage from "./pages/LeadPage"
import Search from "./pages/Search"
import UpdateLead from "./pages/UpdateLead"


function App() {
  return (
      <BrowserRouter>
      <ScrollToTop/>
      <Header/>
      <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/about" element={<About/>} />
      <Route path='/help' element={<Helper/>}/>
      <Route path="sign-up" element={<SignUp/>} />
      <Route path="sign-in" element={<SignIn/>} />
      <Route path="contact-us" element={<ContactUs/>} />
      <Route element={<OnlyAdminPrivateRoute/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="create-lead" element={<CreateLead/>}/>
      <Route path="/lead/:leadSlug" element={<LeadPage/>}/>
      <Route path="/search" element={<Search/>}/>
      <Route path="/leads" element={<Search/>}/>
      <Route path="/update-lead/:leadId" element={<UpdateLead/>}/>
      <Route element={<PrivateRoute/>}/>
      </Routes>
      <Footer />
      </BrowserRouter>
  )
}

export default App
