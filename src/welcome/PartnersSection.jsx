import React from "react";
import { motion } from "framer-motion";
import g from "../ass/5g.jpeg";
import orb from "../ass/orb.png";
import ww from "../ass/ww.png";

const PartnersSection = () => {
  const partners = [
    { id: 1, name: "5AM youth", image: g, color: "from-blue-100 to-blue-200" },
    { id: 2, name: "Orbit innovation hub", image: orb, color: "from-green-100 to-green-200" },
    { id: 3, name: "Wolkite universty ", image: ww, color: "from-purple-100 to-purple-200" },
  ];

  return (
    <div className="relative py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Trusted Partners
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Collaborating with industry leaders to drive innovation
          </p>
        </motion.div>

        {/* Continuous marquee container */}
        <div className="relative h-48 overflow-hidden">
          <motion.div
            className="flex"
            animate={{
              x: ["0%", "-100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...partners, ...partners, ...partners].map((partner, index) => (
              <motion.div
                key={`${partner.id}-${index}`}
                className="px-3 flex-shrink-0 w-60"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className={`bg-gradient-to-br ${partner.color} rounded-xl p-0.5 shadow-lg hover:shadow-xl transition-all duration-300 h-44`}>
                  <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl p-4 group relative overflow-hidden">
                    
                    {/* Uniform image container */}
                    <div className="mb-4 w-28 h-28 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                      <img
                        src={partner.image}
                        alt={partner.name}
                        className="w-full h-full object-contain transform group-hover:scale-105 transition-all duration-300"
                      />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {partner.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersSection;