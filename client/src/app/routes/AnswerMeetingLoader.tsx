import React, { useEffect, useState } from "react";

const AnswerMeetingLoader = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [windowSize, setWindowSize] = useState([0, 0]);

  useEffect(() => {
    if (window.innerWidth === 0) {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }

    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    if (windowSize[0] !== 0) {
      setIsMobile(windowSize[0] < 1024);
    }

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  return (
    <main className="animate-pulse flex flex-1 h-full flex-col lg:justify-center p-5 pt-20 lg:p-20 lg:pt-28 h-smd:pt-20 h-screen w-full lg:w-[800px] overflow-hidden">
      <div className="flex flex-1 lg:flex-none justify-end items-center lg:items-start flex-col-reverse lg:justify-start lg:flex-row">
        {!isMobile && (
          <section className="w-full lg:w-1/2 lg:mr-10">
            <div className="w-64 h-8 bg-gray rounded-lg"></div>
            <div className="w-32 h-6 bg-gray rounded-lg my-4"></div>
            <div className="w-32 h-6 bg-gray rounded-lg mb-4"></div>

            <ul className="w-64 h-64 bg-gray rounded-lg max-h-[100px] h-hd:max-h-[300px]"></ul>
          </section>
        )}

        <section className="flex flex-col lg:w-1/2">
          <form className="flex flex-1 flex-col place-content-start items-center">
            <div className="flex flex-col-reverse lg:flex-col items-center lg:items-start w-full">
              <div className="h-12 w-full bg-gray rounded-lg"></div>
              <div
                className={`h-[250px] h-smd:h-[300px] h-md:h-[350px] h-mdl:h-[400px] h-hd:h-[400px] md:h-lg:h-[600px] lg:h-[500px] w-[360px] lg:w-full mt-5 bg-gray rounded-lg ${
                  isMobile && "mb-5"
                }`}
              ></div>
            </div>
            <div className="flex">
              <div className="h-10 w-24 mr-5 bg-gray rounded-lg mt-5"></div>
              <div className="h-10 w-24 bg-gray rounded-lg mt-5"></div>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default AnswerMeetingLoader;
