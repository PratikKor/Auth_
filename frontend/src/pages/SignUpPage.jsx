import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader, Lock, Mail, User } from 'lucide-react'
import Input from '../components/Input'
import { Link, useNavigate } from 'react-router-dom'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'
import { useAuthStore } from '../store/authStore'

const SignUpPage = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { signup, error, isLoading } = useAuthStore()
    const navigate = useNavigate()

    const handleSignUp = async (e) => {
        e.preventDefault()
        try {
            await signup(email, password, name)
            navigate("/verify-email")
        } catch (error) {
            console.log(error)
        }
    }

    const formVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full bg-gray-900 bg-opacity-70 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-purple-500/30' 
        >
            <div className='p-8'>
                <motion.h2 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                    className='text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text'
                >
                    Create Account
                </motion.h2>

                <motion.form 
                    onSubmit={handleSignUp}
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants}>
                        <Input 
                            icon={User}
                            type='text'
                            placeholder='Full Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Input 
                            icon={Mail}
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Input 
                            icon={Lock}
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </motion.div>
                    {error && <motion.p 
                        variants={itemVariants}
                        className='text-pink-500 font-semibold mt-2'
                    >
                        {error}
                    </motion.p>}
                    <motion.div variants={itemVariants}>
                        <PasswordStrengthMeter password={password} />
                    </motion.div>

                    <motion.button
                        className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
                        whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(147, 51, 234, 0.5)' }}
                        whileTap={{ scale: 0.98 }} 
                        type='submit'
                    >
                        {isLoading ? <Loader className='animate-spin mx-auto' size={24}/> : "Sign Up" }
                    </motion.button>
                </motion.form>
            </div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className='px-8 py-4 bg-gray-900 bg-opacity-70 flex justify-center'
            >
                <p className='text-sm text-gray-400'>
                    Already Have an Account?{' '}
                    <Link to="/login" className='text-purple-400 hover:text-purple-300 transition-colors duration-200'>
                        Login
                    </Link>
                </p>
            </motion.div>
        </motion.div>
    )
}

export default SignUpPage