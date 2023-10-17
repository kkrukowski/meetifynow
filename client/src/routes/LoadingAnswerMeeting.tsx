import React, { useEffect, useState } from "react";

export default function AnswerMeeting(props: any) {
  // Get window size info
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const isMobile = () => {
    return windowSize[0] < 1024;
  };

  return (
    <main className="flex flex-col lg:justify-center p-5 pt-20 lg:p-10 h-screen w-full lg:w-[800px] overflow-hidden">
      <div className="flex flex-1 lg:flex-none justify-end items-center lg:items-start flex-col-reverse lg:justify-start lg:flex-row">
        {!isMobile() && (
          <section className="availability__info w-full lg:w-1/2 lg:mr-10">
            <div className="w-64 h-8 bg-gray rounded-lg animate-pulse"></div>
            <div className="w-32 h-6 bg-gray rounded-lg animate-pulse my-4"></div>
            <div className="w-32 h-6 bg-gray rounded-lg animate-pulse mb-4"></div>

            <ul className="w-64 h-64 bg-gray rounded-lg animate-pulse max-h-[100px] h-hd:max-h-[300px]"></ul>
          </section>
        )}

        <section className="flex flex-col time__selection lg:w-1/2">
          <form className="flex flex-1 flex-col place-content-start items-center">
            <div className="flex flex-col-reverse lg:flex-col items-center lg:items-start">
              <div className="h-10 w-full bg-gray rounded-lg animate-pulse"></div>
              <div
                className={`h-[250px] h-smd:h-[300px] h-md:h-[350px] h-mdl:h-[400px] h-hd:h-[400px] md:h-lg:h-[600px] lg:h-[500px] w-[360px] md:w-[700px] lg:w-[350px] mt-5 bg-gray rounded-lg animate-pulse ${
                  isMobile() && "mb-5"
                }`}
              ></div>
            </div>
            <div className="h-10 w-24 bg-gray rounded-lg animate-pulse mt-5"></div>
          </form>
        </section>
      </div>
    </main>
  );
}
