"use client";
import ArrowRight from "@/assets/icons/ArrowRight.svg";
import StarImage from "@/assets/images/homeImages/star.png";
import SpringImage from "@/assets/images/homeImages/spring.png";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionTitle } from "@/components/SectionTitle";
import { SectionDesc } from "@/components/SectionDesc";

export const CallToAction = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-white to-[#D2DCFF] py-24 overflow-x-clip"
    >
      <div className="container">
        <div className="section-heading relative">
          <SectionTitle
            title="Sign up for free today"
            className="text-center mt-5"
          />
          <SectionDesc
            description="Celebrate the joy of accomplishment with an app designed to track
            your fitness progress and motivate your efforts."
            className="text-center mt-5"
          />
          <motion.img
            src={StarImage.src}
            alt="Star Image"
            width={360}
            className="absolute -left-[350px]  -top-[137px]"
            style={{ translateY }}
          />
          <motion.img
            src={SpringImage.src}
            alt="Spring Image"
            width={360}
            className="absolute -right-[331px] -top-[19px]"
            style={{ translateY }}
          />
        </div>
        <div className="flex gap-2 mt-10 justify-center">
          <a href="#">
            <button className="btn btn-primary">Get for free</button>
          </a>
          <a href="#">
            <button className="btn btn-text gap-1 border border-[#222]/10">
              <span>Learn more</span>
              <ArrowRight className="h-5 w-5 fill-black" />
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};
