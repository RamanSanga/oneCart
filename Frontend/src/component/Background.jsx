import React from "react";
import { motion } from "framer-motion";
import vdo2 from "../assets/vdo2.mp4";

const uploadedVideoModules = import.meta.glob(
  "../assets/hero-media/*.{mp4,webm,mov}",
  {
    eager: true,
    import: "default",
  }
);

const uploadedImageModules = import.meta.glob(
  "../assets/hero-media/*.{png,jpg,jpeg,webp,avif}",
  {
    eager: true,
    import: "default",
  }
);

const uploadedVideos = Object.values(uploadedVideoModules);
const uploadedImages = Object.values(uploadedImageModules).slice(0, 4);

function Background({ heroCount = 0 }) {
  const activeVideo = uploadedVideos[0] || vdo2;

  if (uploadedVideos.length > 0) {
    return (
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden bg-black z-[-1]">
        <motion.video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="w-full h-full object-cover absolute inset-0"
        >
          <source src={activeVideo} type="video/mp4" />
        </motion.video>

        <div className="absolute inset-0 bg-black/20 z-0" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent z-10" />
      </div>
    );
  }

  if (uploadedImages.length > 0) {
    const photoSlots = Array.from({ length: 4 }, (_, index) => {
      const sourceIndex = (heroCount + index) % uploadedImages.length;
      return uploadedImages[sourceIndex];
    });

    return (
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden bg-black z-[-1]">
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3 p-2 sm:p-3">
          {photoSlots.map((src, index) => (
            <motion.div
              key={`${src}-${index}`}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="relative overflow-hidden rounded-[28px] bg-black/10"
            >
              <img
                src={src}
                alt="Hero background"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
            </motion.div>
          ))}
        </div>

        <div className="absolute inset-0 bg-black/20 z-0" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent z-10" />
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-full h-screen overflow-hidden bg-black z-[-1]">
      <motion.video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="w-full h-full object-cover absolute inset-0"
      >
        <source src={activeVideo} type="video/mp4" />
      </motion.video>

      <div className="absolute inset-0 bg-black/20 z-0" />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent z-10" />
    </div>
  );
}

export default Background;













// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import back5 from "../assets/back5.png";
// import back8 from "../assets/back8.png";
// import back1 from "../assets/back1.png";
// import back6 from "../assets/back6.png";
// import vdo from "../assets/vdo.mp4";

// function Background({ heroCount }) {
//   const images = [back8, back5, back1, back6];

//   return (
//     <div className="fixed top-0 left-0 w-full h-screen overflow-hidden bg-transparent z-[-1]">
//       <motion.img
//         key={heroCount}
//         src={images[heroCount % images.length]}
//         alt="Luxury Fashion Hero"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         transition={{ opacity: { duration: 1.2, ease: "easeInOut" } }}
//         loading="lazy"
//         className="w-full h-full object-cover absolute inset-0"
//       />

//       {/* Premium Luxury Overlays - softened so the image stays airy */}
//       <div className="absolute inset-0 bg-black/10 mix-blend-multiply z-0"></div>
//       <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/20 to-transparent z-10"></div>
//     </div>
//   );
// }

// export default Background; 



// //for video 
// import React from "react";
// import { motion } from "framer-motion";
// import vdo2 from "../assets/vdo2.mp4";

// function Background() {
//   return (
//     <div className="fixed top-0 left-0 w-full h-screen overflow-hidden bg-black z-[-1] flex items-center justify-center">
//       <motion.video
//         autoPlay
//         loop
//         muted
//         playsInline
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1.2, ease: "easeInOut" }}
//         className="max-w-full max-h-full object-contain"
//       >
//         <source src={vdo2} type="video/mp4" />
//       </motion.video>

//       <div className="absolute inset-0 bg-black/15 z-0"></div>
//       <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10"></div>
//     </div>
//   );
// }

// export default Background;