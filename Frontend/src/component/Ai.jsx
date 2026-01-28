import React, { useEffect, useRef, useState } from "react";
import { FiMic, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Ai() {
  const navigate = useNavigate();

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognitionRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("Tap to speak");

  useEffect(() => {
    if (!SpeechRecognition) {
      console.error("SpeechRecognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      console.log("🎤 AI Listening...");
      setStatus("Listening...");
      setListening(true);
    };

    recognition.onerror = (e) => {
      console.error("Speech error:", e);
      setStatus("Microphone error");
      setListening(false);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      console.log("🧠 AI Heard:", text);

      setTranscript(text);
      handleVoiceCommand(text); // ✅ USE DIRECT TEXT
    };

    recognition.onend = () => {
      console.log("🛑 AI Stopped");
      setListening(false);
      setStatus("Tap to speak");
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }
    setTranscript("");
    recognitionRef.current.start();
  };

  /* ================= REAL AI COMMAND LOGIC ================= */
const handleVoiceCommand = (text) => {
  if (!text) return;

  console.log("🚀 AI Command Processing:", text);

  const t = text.toLowerCase().trim();

  /* ================= UNIVERSAL HELP ================= */
  if (
    t.includes("what can you do") ||
    t.includes("help me") ||
    t.includes("how can you help") ||
    t.includes("commands")
  ) {
    console.log("ℹ️ AI: Help mode");
    alert(
      "You can say: Open cart, Show wishlist, Track my orders, Show black t-shirts, Go to checkout, Logout, Contact support, and more."
    );
    return;
  }

  /* ================= NAVIGATION ================= */
  if (t.includes("go back")) {
    window.history.back();
    return;
  }

  if (t.includes("go forward")) {
    window.history.forward();
    return;
  }

  /* ================= CART ================= */
  if (
    t.includes("cart") ||
    t.includes("card") ||
    t.includes("kart") ||
    t.includes("bag") ||
    t.includes("shopping bag")
  ) {
    navigate("/cart");
    return;
  }

  if (
    t.includes("checkout") ||
    t.includes("place order") ||
    t.includes("buy now") ||
    t.includes("complete order") ||
    t.includes("pay now")
  ) {
    navigate("/placeorder");
    return;
  }

  if (
    t.includes("clear cart") ||
    t.includes("empty cart") ||
    t.includes("remove all from cart")
  ) {
    alert("Say this feature is coming soon 😉");
    return;
  }

  /* ================= WISHLIST ================= */
  if (
    t.includes("wishlist") ||
    t.includes("wish list") ||
    t.includes("favorites") ||
    t.includes("favourites") ||
    t.includes("saved items")
  ) {
    navigate("/wishlist");
    return;
  }

  /* ================= ACCOUNT ================= */
  if (
    t.includes("account") ||
    t.includes("profile") ||
    t.includes("my account") ||
    t.includes("my profile")
  ) {
    navigate("/account");
    return;
  }

  /* ================= ORDERS ================= */
  if (
    t.includes("orders") ||
    t.includes("my orders") ||
    t.includes("order history") ||
    t.includes("track order") ||
    t.includes("track my order") ||
    t.includes("order status")
  ) {
    navigate("/orders");
    return;
  }

  /* ================= CONTACT / SUPPORT ================= */
  if (
    t.includes("contact") ||
    t.includes("support") ||
    t.includes("help") ||
    t.includes("customer care") ||
    t.includes("call support") ||
    t.includes("complaint")
  ) {
    navigate("/contact");
    return;
  }

  /* ================= ABOUT ================= */
  if (
    t.includes("about") ||
    t.includes("about us") ||
    t.includes("company") ||
    t.includes("brand") ||
    t.includes("who are you")
  ) {
    navigate("/about");
    return;
  }

  /* ================= HOME ================= */
  if (
    t.includes("home") ||
    t.includes("main") ||
    t.includes("landing") ||
    t.includes("start page") ||
    t.includes("go back home")
  ) {
    navigate("/");
    return;
  }

  /* ================= SMART PRODUCT SEARCH ================= */
  const colors = [
    "black",
    "white",
    "red",
    "blue",
    "green",
    "yellow",
    "pink",
    "grey",
    "gray",
    "brown",
    "beige",
    "cream"
  ];

  const types = [
    "t shirt",
    "t-shirt",
    "shirt",
    "jeans",
    "pants",
    "trouser",
    "jacket",
    "hoodie",
    "sweatshirt",
    "kurta",
    "dress",
    "top",
    "shorts"
  ];

  let detectedColor = colors.find((c) => t.includes(c));
  let detectedType = types.find((p) => t.includes(p));

  if (
    t.includes("show") ||
    t.includes("find") ||
    t.includes("search") ||
    detectedColor ||
    detectedType
  ) {
    console.log("🛍️ AI: Smart Search", { detectedColor, detectedType });

    navigate("/collection");

    // OPTIONAL: store filters globally (if you add this feature)
    // window.localStorage.setItem("aiColor", detectedColor || "");
    // window.localStorage.setItem("aiType", detectedType || "");

    return;
  }

  /* ================= ADD TO CART (INTENT ONLY) ================= */
  if (
    t.includes("add to cart") ||
    t.includes("add this to cart") ||
    t.includes("buy this") ||
    t.includes("add this")
  ) {
    alert("Please select size and tap Add to Cart for this item.");
    return;
  }

  /* ================= LOGOUT ================= */
  if (
    t.includes("logout") ||
    t.includes("log out") ||
    t.includes("sign out") ||
    t.includes("exit account")
  ) {
    document.querySelector("[data-logout-btn]")?.click();
    return;
  }

  /* ================= FALLBACK ================= */
  console.log("❓ AI: No command matched:", t);

  // Premium fallback UX
  alert(
    "Sorry, I didn’t catch that. Try saying: 'Open cart', 'Show black t-shirts', or 'Track my orders'."
  );
};



  return (
    <>
      {/* ===== FLOATING AI BUTTON ===== */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-black text-white shadow-2xl flex items-center justify-center hover:scale-105 transition"
      >
        <FiMic size={22} />
      </button>

      {/* ===== AI OVERLAY ===== */}
      {open && (
        <div className="fixed inset-0 z-[9998] bg-black/40 flex items-end md:items-center justify-center">
          <div className="bg-white w-full md:w-[420px] rounded-t-3xl md:rounded-3xl p-6 shadow-2xl">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-xs tracking-[0.4em] uppercase text-gray-400">
                OneCart AI
              </p>
              <button onClick={() => setOpen(false)}>
                <FiX size={20} />
              </button>
            </div>

            <h2 className="text-2xl font-light mb-2">
              Speak naturally.
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Say: "Show black t-shirts", "Open cart", "Go to wishlist"
            </p>

            {/* MIC */}
            <button
              onClick={startListening}
              className={`w-full py-4 rounded-xl border border-black flex items-center justify-center gap-3 uppercase tracking-widest text-sm transition ${
                listening
                  ? "bg-black text-white"
                  : "hover:bg-black hover:text-white"
              }`}
            >
              <FiMic />
              {listening ? "Listening..." : "Tap to Speak"}
            </button>

            {/* TRANSCRIPT */}
            <div className="mt-6 bg-gray-50 border rounded-xl p-4 min-h-[80px]">
              <p className="text-xs tracking-widest text-gray-400 mb-2">
                Voice Input
              </p>

              {transcript ? (
                <p className="text-sm">{transcript}</p>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Waiting for your voice...
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Ai;
