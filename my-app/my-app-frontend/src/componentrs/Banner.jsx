
import banner from '../assets/images/banner.jpg';

function Banner() {
  return (
    <>
    <div className='max-w-screen-2xl container mx-auto md:px-20 px-4 flex flex-col md:flex-row my-10'>
    <div className='w-full md:w-1/2 order-2 md:order-1  md mt-32'>
    <div className='space-y-12'>
    <h1 className='font-bold text-4xl'>Hello! Digital Library for Books Everyday
      <span className='text-pink-500'> by Kabiru </span>
         </h1>
         <p className='text-xl'>Welcome to NDU DigitalLibrary — your digital home for stories, learning, and imagination.
Explore thousands of titles anytime, anywhere. From timeless classics to bold new voices, every shelf invites discovery. Search, borrow, and build your own reading list with ease — your next favorite book is only a click away. Join a community of readers who share, review, and celebrate the power of words. Settle in — your next chapter starts here.
          </p> 
          <label className="input input-bordered flex items-center gap-2">
    <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-3 w-3 opacity-70">
    <path
      d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
    <path
      d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
    </svg>
    <input type="text" className="grow" placeholder="Email" />
    </label>
    <label className="input input-bordered flex items-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="h-3 w-3 opacity-70">
    <path
      fillRule="evenodd"
      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
      clipRule="evenodd" />
    </svg>
    <input type="password" className="grow" placeholder="password" />
    </label>
    <button className="btn btn-active btn-primary">Sign in</button>
    </div>
    </div>
    <div className='order-1 w-82 md:w-1/2 md mt-28 ml-12'>
      <img src={banner} className='w-82 h-75 ' alt='' />
    </div>
    </div>
    </>
  )
}

export default Banner
