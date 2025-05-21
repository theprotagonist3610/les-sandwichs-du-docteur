import { useEffect, useState } from "react";

const AnimatedLoader = ({
  loading = true,
  fullText = "Chargement du menu du jour...",
}) => {
  const [animatedText, setAnimatedText] = useState("");

  useEffect(() => {
    let interval;
    let timeout;
    if (loading) {
      let i = 0;
      let forward = true;

      const write = () => {
        interval = setInterval(() => {
          i++;
          setAnimatedText(fullText.slice(0, i));
          if (i === fullText.length) {
            clearInterval(interval);
            timeout = setTimeout(erase, 500);
          }
        }, 100);
      };

      const erase = () => {
        interval = setInterval(() => {
          i--;
          setAnimatedText(fullText.slice(0, i));
          if (i === 0) {
            clearInterval(interval);
            timeout = setTimeout(write, 500);
          }
        }, 80);
      };

      write();
    } else {
      setAnimatedText("");
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [loading, fullText]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white px-8 py-6 rounded-md shadow-lg text-center space-y-4 pointer-events-auto">
        <div className="flex justify-center space-x-2">
          <span
            className="w-3 h-3 rounded-full bg-doctor-red animate-bounce"
            style={{ animationDelay: "0s" }}></span>
          <span
            className="w-3 h-3 rounded-full bg-doctor-orange animate-bounce"
            style={{ animationDelay: "0.2s" }}></span>
          <span
            className="w-3 h-3 rounded-full bg-doctor-deeporange animate-bounce"
            style={{ animationDelay: "0.4s" }}></span>
        </div>
        <p className="text-doctor-red font-medium italic text-base">
          {animatedText}
          <span className="animate-pulse ml-1">|</span>
        </p>
      </div>
    </div>
  );
};

export default AnimatedLoader;
