import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      window.scrollY > 300 ? setShowButton(true) : setShowButton(false);
    });

    return () => window.removeEventListener("scroll", () => {});
  }, [window.scrollY]);

  return (
    <div
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed z-10 transition ease-in-out active:scale-90 duration-100 bottom-5 md:right-5 right-3 font-semibold bg-black text-white text-center px-3 py-2 min-w-[10rem] w-auto rounded-lg ${
        showButton ? "scale-100" : "scale-0"
      }`}
      role="button"
    >
      {window.location.href.includes("cart")
        ? "Go to Top to Checkout"
        : "Go To Top"}
    </div>
  );
};

export default ScrollToTop;
