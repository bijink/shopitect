import Image from 'next/image'
import LandingPageBtn from './landingPage.Btn'
import LandingPageBg from './landingPageBg'

export default function Home() {
  return (
    <div className="h-screen relative overflow-hidden">
      <LandingPageBg />
      <div className="flex flex-col justify-center items-center space-y-8">
        <div className="flex flex-col items-center space-y-0 pt-24 min-h-[75vh] text-center">
          {/* <LandingPageLogo /> */}
          <Image
            src="/image/shopitect-logo.png"
            alt="shopitect logo"
            width={180}
            height={180}
          />
          <h1 className="text-2xl sm:text-5xl">
            Welcome to <b>Shopitect</b>
          </h1>
          <p>An architect of shop management application</p>
          <LandingPageBtn />
        </div>
        <div className="flex flex-col text-center">
          <div className="flex justify-center space-x-1 pb-0.5">
            {/* <App_about /> */}
            {/* <App_help /> */}
          </div>
          <a
            href="https://github.com/bijink/shopitect"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* <GitHubIcon style={{ color: "black" }} /> */}
          </a>
          <p>
            Copyright © 2024&nbsp;
            <a
              href="https://github.com/bijink"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:cursor-pointer hover:underline decoration-0"
            >
              Bijin Krishn
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
