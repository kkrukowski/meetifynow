"use client";

import { Locale } from "@root/i18n.config";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";

import Button from "@/components/Button";
import { BlurText } from "@/components/ui/BlurText";

// Icons for the "How it works" and Feature Grid sections
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Globe,
  MousePointer2,
  Users,
  Zap,
} from "lucide-react";

export default function HomePage({ dict }: { lang: Locale; dict: any }) {
  const features = useMemo(
    () => [
      {
        icon: <Zap className="w-6 h-6 text-primary" />,
        title: dict.page.home.infoBlock.fast.title,
        text: dict.page.home.infoBlock.fast.text,
      },
      {
        icon: <Users className="w-6 h-6 text-primary" />,
        title: dict.page.home.infoBlock.everyone.title,
        text: dict.page.home.infoBlock.everyone.text,
      },
      {
        icon: <Clock className="w-6 h-6 text-primary" />,
        title: dict.page.home.infoBlock.flexibleHours.title,
        text: dict.page.home.infoBlock.flexibleHours.text,
      },
      {
        icon: <Globe className="w-6 h-6 text-primary" />,
        title: dict.page.home.infoBlock.online.title,
        text: dict.page.home.infoBlock.online.text,
      },
    ],
    [dict],
  );

  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  // Splitting title to add accent color to the last word.
  // Assuming title is something like "Planowanie spotkań nigdy nie było prostsze!"
  // We'll highlight the final word (or specific phrase).
  const titleWords = dict.page.home.title
    ? dict.page.home.title.split(" ")
    : [];
  const lastWord = titleWords.length > 0 ? titleWords.pop() : "";
  const restOfTitle = titleWords.join(" ");

  return (
    <main className="w-full flex-col items-center bg-[#f8fafc] text-gray-800 min-h-screen selection:bg-primary/20 relative">
      {/* Abstract Animated Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgNDBMNDAgMG0tMjAgNDBMMDAiIHN0cm9rZT0iI2RmZTJlNSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==')] [mask-image:linear-gradient(to_bottom,white_10%,transparent_70%)]" />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden w-full pt-44 pb-20 md:pt-56 md:pb-32 px-5 flex flex-col items-center text-center border-b border-gray-200/50 bg-white/80 backdrop-blur-sm z-10">
        {/* Soft UI glowing blobs */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-300/20 blur-[120px] rounded-full pointer-events-none -z-10"
        />

        <motion.div
          initial="hidden"
          animate="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15 } },
          }}
          className="max-w-4xl mx-auto flex flex-col items-center z-10"
        >
          {/* Animated Hero Text with Accent Word */}
          <motion.div
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-[1.15] flex flex-wrap justify-center gap-x-4"
          >
            {restOfTitle && <span className="inline-block">{restOfTitle}</span>}
            {lastWord && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-primary inline-block"
              >
                {lastWord}
              </motion.span>
            )}
          </motion.div>

          <motion.p
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed mb-10"
          >
            {dict.page.home.headerText}
          </motion.p>

          <motion.div
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
          >
            <Link href="meet/new">
              <Button
                text={dict.page.home.createButton}
                className="text-base px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-full shadow-[0_4px_20px_-5px_rgba(var(--primary),0.4)] hover:-translate-y-0.5 transition-all duration-300 font-medium"
              />
            </Link>
            <Link href="#features">
              <button className="text-base px-6 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-full transition-all duration-300 font-medium whitespace-nowrap shadow-sm hover:-translate-y-0.5">
                Dowiedz się więcej
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating Quick UI Demo blocks */}
        <div className="hidden lg:block w-full max-w-6xl mx-auto relative h-32 mt-12 pointer-events-none">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute left-10 top-0 bg-white/90 backdrop-blur border border-gray-200 shadow-xl rounded-2xl p-4 w-64 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex justify-center items-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Czw, 18 Kwi</p>
              <p className="text-xs text-gray-500">3 osoby dostepne</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute right-10 top-10 bg-white/90 backdrop-blur border border-gray-200 shadow-xl rounded-2xl p-4 w-64"
          >
            <p className="text-xs text-primary font-bold mb-2">Twój wybór</p>
            <div className="space-y-2">
              <motion.div
                animate={{ backgroundColor: ["#f3f4f6", "#e0f2fe", "#f3f4f6"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-full h-8 rounded-md flex items-center px-3 border border-primary/30"
              >
                <span className="text-xs font-medium text-gray-800">
                  14:00 - 15:30
                </span>
              </motion.div>
              <div className="w-full h-8 bg-gray-50 rounded-md flex items-center px-3 border border-gray-100">
                <span className="text-xs font-medium text-gray-400">
                  16:00 - 17:00
                </span>
              </div>
            </div>
            <motion.div
              animate={{ x: [0, 15, 0], y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -right-3 -bottom-3 text-gray-800 drop-shadow-md z-10"
            >
              <MousePointer2 className="w-8 h-8 fill-primary stroke-white stroke-[1.5]" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. PRIMARY HIGHLIGHT / TABS */}
      <section
        id="features"
        className="py-24 md:py-32 px-5 relative bg-white z-10"
      >
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center flex flex-col items-center relative z-10">
          <p className="text-primary font-semibold mb-4 tracking-wide uppercase text-sm">
            Dlaczego MeetifyNow?
          </p>
          <BlurText
            text="Planuj spotkania błyskawicznie"
            delay={0}
            className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {[
              {
                title: "Brak logowania",
                desc: "Zacznij planować od razu, bez tracenia czasu na tworzenie kont i haseł.",
                icon: <Zap className="w-5 h-5 text-primary" />,
              },
              {
                title: "Widok kalendarza",
                desc: "Czytelny, intuicyjny interfejs ułatwiający szybkie znalezienie wspólnego terminu.",
                icon: <CalendarDays className="w-5 h-5 text-primary" />,
              },
              {
                title: "Inteligentne sugerowanie",
                desc: "System sam podpowie optymalne okna czasowe dla całej grupy.",
                icon: <CheckCircle2 className="w-5 h-5 text-primary" />,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group p-8 rounded-2xl bg-[#f8fafc]/50 backdrop-blur-sm border border-gray-200 hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Abstract calendar/app representation animated */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 w-full max-w-5xl h-72 md:h-96 rounded-[32px] bg-[#f8fafc] border border-gray-200 shadow-2xl shadow-gray-200/50 flex flex-col items-center justify-start relative overflow-hidden pt-8"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            {/* Mockup Header */}
            <div className="w-3/4 max-w-2xl h-10 border border-gray-200 flex items-center px-4 gap-2 mb-8 z-10 bg-white/70 backdrop-blur-md rounded-2xl shadow-sm">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="ml-4 h-4 w-32 bg-gray-200 rounded-full"></div>
            </div>

            {/* Mockup Grid Data elements animating in */}
            <div className="w-3/4 max-w-2xl grid grid-cols-4 gap-4 z-10 px-4 md:px-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className={`h-16 rounded-xl border ${i === 5 || i === 6 ? "bg-primary border-primary shadow-lg shadow-primary/30 flex justify-center items-center" : "bg-white border-gray-100 shadow-sm"}`}
                >
                  {(i === 5 || i === 6) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.05, type: "spring" }}
                    >
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-[#f8fafc] to-transparent z-20" />
          </motion.div>
        </div>
      </section>

      {/* 3. FEATURES GRID */}
      <section className="py-20 md:py-32 px-5 bg-[#f8fafc] border-y border-gray-200/50 z-10 relative">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <BlurText
            text="Wszystko, czego potrzebujesz"
            delay={0}
            className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-16 text-center"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {features.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white border border-gray-100 hover:border-primary/30 p-6 rounded-2xl flex flex-col items-start text-left cursor-default transition-all group hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/50"
              >
                <div className="p-3 bg-primary/5 rounded-xl mb-5 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS / THREE STEPS */}
      <section className="py-24 md:py-32 px-5 relative w-full flex justify-center bg-white">
        <div className="max-w-5xl w-full flex flex-col items-center text-center">
          <p className="text-primary font-semibold mb-4 tracking-wide uppercase text-sm">
            Jak to działa?
          </p>
          <BlurText
            text="Planuj. Wybieraj. Spotkaj się."
            delay={0}
            className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4"
          />
          <p className="text-gray-600 max-w-2xl mb-16">
            Trzy proste kroki dzielą Cię i Twój zespół od idealnie dopasowanego
            grafiku. Żadnego błądzenia w e-mailach.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
            {[
              {
                title: "1. Zaproponuj terminy",
                desc: "Wybierasz kilka dogodnych dla siebie opcji i zamykasz je w wygenerowanym linku.",
              },
              {
                title: "2. Prześlij i zagłosujcie",
                desc: "Udostępniasz widok grupie. Wszyscy anonimowo i sprawnie oddają głos.",
              },
              {
                title: "3. Idealny czas",
                desc: "MeetifyNow w sekundy wskaże rozwiązanie pasujące największej liczbie osób.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/50 transition-all p-8 rounded-3xl relative overflow-hidden"
              >
                <div className="absolute -top-4 -right-4 p-4 opacity-5 pointer-events-none">
                  <span className="text-9xl font-black text-primary">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 relative z-10">
                  {step.title}
                </h3>
                <p className="text-gray-600 relative z-10 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BOTTOM GLOWING CTA */}
      <section className="w-full py-32 px-5 relative flex justify-center items-end min-h-[400px] bg-white border-t border-gray-100">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[300px] bg-primary/10 blur-[150px] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center flex flex-col items-center relative z-10">
          <BlurText
            text="Proste w użyciu. Potężne w działaniu."
            delay={0}
            className="text-4xl md:text-6xl font-black text-gray-900 mb-6"
          />
          <p className="text-lg text-gray-600 mb-10 max-w-xl">
            Przestańcie wymieniać dziesiątki wiadomości w poszukiwaniu jednego
            pasującego terminu. Dołącz do zadowolonych użytkowników.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="meet/new">
              <button className="text-base px-8 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-full font-bold shadow-[0_0_40px_-5px_rgba(var(--primary),0.4)] transition-all duration-300 group flex items-center gap-2">
                Zacznij planować
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
