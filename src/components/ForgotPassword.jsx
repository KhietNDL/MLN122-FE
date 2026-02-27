import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <>
      {/* Background */}
      <div className="bg-purple-900 absolute top-0 left-0 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-800 bottom-0 leading-5 h-full w-full overflow-hidden" />

      {/* Main container */}
      <div className="relative min-h-screen sm:flex sm:flex-row justify-center bg-transparent rounded-3xl shadow-xl">

        {/* Left – info text */}
        <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
          <div className="self-start hidden lg:flex flex-col text-gray-300">
            <h1 className="my-3 font-semibold text-4xl">Forgot your password?</h1>
            <p className="pr-3 text-sm opacity-75">
              No worries! Enter your email address and we&apos;ll send you a link
              to reset your password in just a few moments.
            </p>
          </div>
        </div>

        {/* Right – card */}
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-3xl w-96">

            {!submitted ? (
              <>
                {/* Icon */}
                <div className="mb-7 flex flex-col items-start">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 mb-4">
                    <svg className="w-7 h-7 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-2xl text-gray-800">Reset Password</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Enter the email associated with your account and we&apos;ll send you a reset link.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Email */}
                  <div>
                    <input
                      className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                      type="email"
                      placeholder="Email address"
                    />
                  </div>

                  {/* Submit */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setSubmitted(true)}
                      className="w-full flex justify-center bg-purple-800 hover:bg-purple-700 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500"
                    >
                      Send Reset Link
                    </button>
                  </div>

                  {/* Back to login */}
                  <div className="text-center">
                    <Link
                      to="/"
                      className="inline-flex items-center gap-1 text-sm text-purple-700 hover:text-purple-600"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Sign In
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              /* Success state */
              <div className="flex flex-col items-center text-center space-y-5 py-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100">
                  <svg className="w-8 h-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-2xl text-gray-800">Check your email</h3>
                <p className="text-gray-400 text-sm">
                  We&apos;ve sent a password reset link to your email address.
                  Please check your inbox (and spam folder).
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="w-full flex justify-center bg-purple-800 hover:bg-purple-700 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500"
                >
                  Resend Email
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center gap-1 text-sm text-purple-700 hover:text-purple-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Sign In
                </Link>
              </div>
            )}

            {/* Footer note */}
            <div className="mt-7 text-center text-gray-300 text-xs">
              <span>
                Copyright © 2021-2023{' '}
                <a
                  href="https://codepen.io/uidesignhub"
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-500 hover:text-purple-600"
                >
                  AJI
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wave SVG */}
      <svg className="absolute bottom-0 left-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#fff"
          fillOpacity="1"
          d="M0,0L40,42.7C80,85,160,171,240,197.3C320,224,400,192,480,154.7C560,117,640,75,720,74.7C800,75,880,117,960,154.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        />
      </svg>
    </>
  )
}
