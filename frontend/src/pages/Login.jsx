import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

const [state, setState] = useState('Sign Up')

const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

const navigate = useNavigate()
const { backendUrl, token, setToken } = useContext(AppContext)

const onSubmitHandler = async (event) => {
event.preventDefault();

try {

  if (state === 'Sign Up') {

    const { data } = await axios.post(
      backendUrl + '/api/user/register',
      { name, email, password }
    )

    if (data.success) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.userId)

      setToken(data.token)
      toast.success("Account created ✅")

    } else {
      toast.error(data.message)
    }

  } else {

    const { data } = await axios.post(
      backendUrl + '/api/user/login',
      { email, password }
    )

    if (data.success) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.userId)

      setToken(data.token)
      toast.success("Login successful ✅")

    } else {
      toast.error(data.message)
    }

  }

} catch (error) {
  console.log(error)
  toast.error("Something went wrong")
}

}

useEffect(() => {
if (token) {
navigate('/')
}
}, [token])

return (

<div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500">

  {/* background blur shapes */}
  <div className="absolute w-[500px] h-[500px] bg-purple-500 rounded-full blur-[120px] opacity-30 top-[-120px] left-[-120px]"></div>
  <div className="absolute w-[500px] h-[500px] bg-cyan-400 rounded-full blur-[120px] opacity-30 bottom-[-120px] right-[-120px]"></div>

  <form
    onSubmit={onSubmitHandler}
    className="relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 w-[380px] flex flex-col gap-5 text-white animate-fadeIn"
  >

    {/* logo */}
    <div className="flex flex-col items-center mb-2">

      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-xl shadow-lg mb-2">
        VM
      </div>

      <h1 className="text-2xl font-bold tracking-wide">
        VitaMed Clinic
      </h1>

      <p className="text-sm opacity-80">
        {state === 'Sign Up' ? 'Create your account' : 'Welcome back'}
      </p>

    </div>

    {state === 'Sign Up' && (
      <div className="flex flex-col gap-1">
        <label className="text-sm opacity-80">Full Name</label>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          required
          className="bg-white/20 border border-white/30 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-white transition"
        />
      </div>
    )}

    <div className="flex flex-col gap-1">
      <label className="text-sm opacity-80">Email</label>
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        required
        className="bg-white/20 border border-white/30 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-white transition"
      />
    </div>

    <div className="flex flex-col gap-1">
      <label className="text-sm opacity-80">Password</label>
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        required
        className="bg-white/20 border border-white/30 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-white transition"
      />
    </div>

    <button
      className="mt-2 bg-white text-blue-600 font-semibold py-2 rounded-lg hover:scale-105 hover:bg-gray-100 transition-all duration-300 shadow-lg"
    >
      {state === 'Sign Up' ? 'Create account' : 'Login'}
    </button>

    {state === 'Sign Up' ? (
      <p className="text-center text-sm opacity-90">
        Already have an account?
        <span
          onClick={() => setState('Login')}
          className="ml-1 underline cursor-pointer hover:text-blue-200"
        >
          Login here
        </span>
      </p>
    ) : (
      <p className="text-center text-sm opacity-90">
        Create a new account?
        <span
          onClick={() => setState('Sign Up')}
          className="ml-1 underline cursor-pointer hover:text-blue-200"
        >
          Click here
        </span>
      </p>
    )}

  </form>

</div>

)
}

export default Login