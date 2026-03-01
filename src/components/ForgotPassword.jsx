import { useState } from 'react'
import { Link } from 'react-router-dom'
import CardTransition from './CardTransition'

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
            <h1 className="my-3 font-semibold text-4xl">Quên mật khẩu?</h1>
            <p className="pr-3 text-sm opacity-75">
              Không sao! Nhập email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu ngay.
            </p>
          </div>
        </div>

        {/* Right – card */}
        <div className="flex justify-center self-center z-10">
          <CardTransition>
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
                  <h3 className="font-semibold text-2xl text-gray-800">Đặt lại mật khẩu</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Nhập email gắn với tài khoản của bạn, chúng tôi sẽ gửi liên kết đặt lại cho bạn.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Email */}
                  <div>
                    <input
                      className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                      type="email"
                      placeholder="Địa chỉ email"
                    />
                  </div>

                  {/* Submit */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setSubmitted(true)}
                      className="w-full flex justify-center bg-purple-800 hover:bg-purple-700 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500"
                    >
                      Gửi liên kết đặt lại
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
                      Quảy lại đăng nhập
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
                <h3 className="font-semibold text-2xl text-gray-800">Kiểm tra email của bạn</h3>
                <p className="text-gray-400 text-sm">
                  Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email của bạn.
                  Vui lòng kiểm tra hộp thư đến (và thư rác).
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="w-full flex justify-center bg-purple-800 hover:bg-purple-700 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500"
                >
                  Gửi lại email
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center gap-1 text-sm text-purple-700 hover:text-purple-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Quảy lại đăng nhập
                </Link>
              </div>
            )}

            <div className="mt-7 text-center text-gray-400 text-xs">
              Dữ liệu được tính toán hoàn toàn cục bộ. Không lưu thông tin cá nhân.
            </div>
          </div>
          </CardTransition>
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
