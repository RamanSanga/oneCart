import React, { useEffect, useRef, useState } from "react";

function ScrollStatement() {
  const ref = useRef(null);
  const [state, setState] = useState("idle");

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const center = window.innerHeight * 0.45;

      if (rect.top < center && rect.bottom > center) {
        setState("active");
      } else if (rect.bottom < center) {
        setState("exit");
      } else {
        setState("idle");
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="sticky-wrap">
      <div
        ref={ref}
        className={`sticky-text ${
          state === "active"
            ? "active"
            : state === "exit"
            ? "exit"
            : ""
        }`}
      >
        Fashion is not fast.
        <br />
        It moves with you.
      </div>
    </section>
  );
}

export default ScrollStatement;

