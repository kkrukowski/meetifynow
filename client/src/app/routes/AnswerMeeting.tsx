"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import _ from "lodash";
import moment from "moment";
import "moment/locale/pl";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import * as yup from "yup";

// Components
import Button from "@/components/Button";
import CopyLinkButton from "@/components/CopyLinkButton";
import Heading from "@/components/Heading";
import Input from "@/components/Input";
import { LinkButton } from "@/components/LinkButton";
import Title from "@/components/Title";

// Utils
import { getAvailabilityInfo } from "@/utils/meeting/answer/getAvailabilityInfo";
import { getUnavailableUsersInfo } from "@/utils/meeting/answer/getUnavailableUsersInfo";
import useMouseDown from "@/utils/useIsMouseDown";
import { Locale } from "@root/i18n.config";

export default function AnswerMeeting({
  lang,
  dict,
  meetingData,
  session,
}: {
  lang: Locale;
  dict: any;
  meetingData: any;
  session: any;
}) {
  moment.locale(lang);
  const pathname = usePathname();

  // OPTYMALIZACJA: Memoizacja stałych danych
  const staticMeetingData = useMemo(
    () => ({
      meetName: meetingData.meetName,
      appointmentId: meetingData.appointmentId,
      meetPlace: meetingData.meetPlace,
      meetLink: meetingData.meetLink,
      dates: meetingData.dates?.sort() || [],
    }),
    [meetingData]
  );

  // OPTYMALIZACJA: Memoizacja flatTimes z szczegółową analizą danych spotkania
  const flatTimes = useMemo(() => {
    console.log("🔧 OPTYMALIZACJA: Rozpoczęcie analizy danych spotkania", {
      rawMeetingData: meetingData,
      staticMeetingDataDates: staticMeetingData.dates,
      timestamp: new Date().toISOString(),
    });

    // DEBUG: Szczegółowa analiza każdego dnia z bazy danych
    const detailedDayAnalysis = staticMeetingData.dates.map(
      (dateObj: any, index: number) => {
        console.log(`📅 DEBUG: Analiza dnia ${index + 1} - surowe dane`, {
          dayIndex: index,
          rawDateObject: dateObj,
          hasDate: !!dateObj.date,
          hasTimes: !!dateObj.times,
          timesIsArray: Array.isArray(dateObj.times),
          timesLength: dateObj.times?.length || 0,
          timestamp: new Date().toISOString(),
        });

        const dayDate = new Date(dateObj.date);
        const dayTimes = dateObj.times || [];

        // Konwersja każdego timestampu na czytelny format
        const timesWithDetails = dayTimes.map(
          (timestamp: number, timeIndex: number) => {
            const timeMoment = moment(timestamp);
            return {
              timeIndex,
              timestamp,
              formatted: timeMoment.format("YYYY-MM-DD HH:mm:ss"),
              dateOnly: timeMoment.format("YYYY-MM-DD"),
              timeOnly: timeMoment.format("HH:mm"),
              hour: timeMoment.hour(),
              minute: timeMoment.minute(),
              dayOfWeek: timeMoment.format("dddd"),
              isWeekend: timeMoment.day() === 0 || timeMoment.day() === 6,
              isValid: timeMoment.isValid(),
            };
          }
        );

        const dayAnalysis = {
          dayIndex: index,
          originalDate: dateObj.date,
          dateFormatted: dayDate.toLocaleDateString("pl-PL"),
          dayName: dayDate.toLocaleDateString("pl-PL", { weekday: "long" }),
          dayOfWeek: dayDate.getDay(),
          isWeekend: dayDate.getDay() === 0 || dayDate.getDay() === 6,
          timesCount: dayTimes.length,
          timesRaw: dayTimes,
          timesDetailed: timesWithDetails,
          timeSlots: timesWithDetails.map((t) => t.timeOnly).sort(),
          uniqueHours: [...new Set(timesWithDetails.map((t) => t.hour))].sort(),
          uniqueMinutes: [
            ...new Set(timesWithDetails.map((t) => t.minute)),
          ].sort(),
          hourRange:
            dayTimes.length > 0
              ? {
                  earliest: Math.min(...dayTimes),
                  latest: Math.max(...dayTimes),
                  earliestFormatted: moment(Math.min(...dayTimes)).format(
                    "HH:mm"
                  ),
                  latestFormatted: moment(Math.max(...dayTimes)).format(
                    "HH:mm"
                  ),
                  span: `${moment(Math.min(...dayTimes)).format(
                    "HH:mm"
                  )} - ${moment(Math.max(...dayTimes)).format("HH:mm")}`,
                  totalHours:
                    moment(Math.max(...dayTimes)).hour() -
                    moment(Math.min(...dayTimes)).hour() +
                    1,
                }
              : null,
        };

        console.log(
          `📊 DEBUG: Kompletna analiza dnia ${index + 1} (${
            dayAnalysis.dateFormatted
          })`,
          {
            ...dayAnalysis,
            sampleTimes: timesWithDetails.slice(0, 5), // pierwsze 5 czasów jako przykład
            timestamp: new Date().toISOString(),
          }
        );

        return dayAnalysis;
      }
    );

    console.log("📋 DEBUG: Zestawienie wszystkich dni spotkania", {
      totalDays: detailedDayAnalysis.length,
      daysOverview: detailedDayAnalysis.map((day) => ({
        date: day.dateFormatted,
        dayName: day.dayName,
        timesCount: day.timesCount,
        hourSpan: day.hourRange?.span || "Brak czasów",
        firstTime: day.timesDetailed[0]?.timeOnly || "Brak",
        lastTime:
          day.timesDetailed[day.timesDetailed.length - 1]?.timeOnly || "Brak",
      })),
      timestamp: new Date().toISOString(),
    });

    // Flatten wszystkich czasów z wszystkich dni
    const times = staticMeetingData.dates.flatMap((date: any) => date.times);

    // DEBUG: Analiza wszystkich płaskich czasów
    const allTimesAnalysis = times.map((timestamp: number, index: number) => {
      const timeMoment = moment(timestamp);
      return {
        globalIndex: index,
        timestamp,
        formatted: timeMoment.format("YYYY-MM-DD HH:mm:ss"),
        dateOnly: timeMoment.format("YYYY-MM-DD"),
        timeOnly: timeMoment.format("HH:mm"),
        hour: timeMoment.hour(),
        minute: timeMoment.minute(),
        dayOfWeek: timeMoment.format("dddd"),
        whichDay:
          detailedDayAnalysis.findIndex(
            (day) =>
              timeMoment.format("YYYY-MM-DD") ===
              moment(day.originalDate).format("YYYY-MM-DD")
          ) + 1,
      };
    });

    console.log("🌍 DEBUG: Analiza wszystkich flatTimes z bazy danych", {
      totalTimes: times.length,
      totalDays: staticMeetingData.dates.length,
      averageTimesPerDay: (
        times.length / staticMeetingData.dates.length
      ).toFixed(2),
      allTimesBreakdown: allTimesAnalysis.slice(0, 15), // pierwsze 15 jako przykład
      timesByDay: detailedDayAnalysis.reduce((acc, day) => {
        acc[`Dzień ${day.dayIndex + 1} (${day.dateFormatted})`] =
          day.timesCount;
        return acc;
      }, {} as Record<string, number>),
      timestamp: new Date().toISOString(),
    });

    // DEBUG: Globalne statystyki czasowe
    const globalTimeStats = {
      allUniqueHours: [...new Set(allTimesAnalysis.map((t) => t.hour))].sort(),
      allUniqueMinutes: [
        ...new Set(allTimesAnalysis.map((t) => t.minute)),
      ].sort(),
      allUniqueDates: [
        ...new Set(allTimesAnalysis.map((t) => t.dateOnly)),
      ].sort(),
      allUniqueTimeSlots: [
        ...new Set(allTimesAnalysis.map((t) => t.timeOnly)),
      ].sort(),
      earliestGlobalTime: times.length > 0 ? Math.min(...times) : null,
      latestGlobalTime: times.length > 0 ? Math.max(...times) : null,
    };

    if (
      globalTimeStats.earliestGlobalTime &&
      globalTimeStats.latestGlobalTime
    ) {
      globalTimeStats.earliestFormatted = moment(
        globalTimeStats.earliestGlobalTime
      ).format("YYYY-MM-DD HH:mm");
      globalTimeStats.latestFormatted = moment(
        globalTimeStats.latestGlobalTime
      ).format("YYYY-MM-DD HH:mm");
      globalTimeStats.globalSpan = `${moment(
        globalTimeStats.earliestGlobalTime
      ).format("HH:mm")} - ${moment(globalTimeStats.latestGlobalTime).format(
        "HH:mm"
      )}`;
    }

    console.log("📈 DEBUG: Globalne statystyki czasowe spotkania", {
      ...globalTimeStats,
      hourRange:
        globalTimeStats.allUniqueHours.length > 0
          ? `${globalTimeStats.allUniqueHours[0]}:00 - ${
              globalTimeStats.allUniqueHours[
                globalTimeStats.allUniqueHours.length - 1
              ]
            }:59`
          : "Brak",
      minuteDistribution: globalTimeStats.allUniqueMinutes.reduce(
        (acc, minute) => {
          acc[`${minute.toString().padStart(2, "0")}min`] =
            allTimesAnalysis.filter((t) => t.minute === minute).length;
          return acc;
        },
        {} as Record<string, number>
      ),
      dateDistribution: globalTimeStats.allUniqueDates.reduce((acc, date) => {
        acc[date] = allTimesAnalysis.filter((t) => t.dateOnly === date).length;
        return acc;
      }, {} as Record<string, number>),
      timestamp: new Date().toISOString(),
    });

    // DEBUG: Wykrywanie wzorców i anomalii
    const patterns = {
      hasOnlyFullHours: globalTimeStats.allUniqueMinutes.every((m) => m === 0),
      hasOnlyHalfHours: globalTimeStats.allUniqueMinutes.every(
        (m) => m === 0 || m === 30
      ),
      hasQuarterHours: globalTimeStats.allUniqueMinutes.every(
        (m) => m % 15 === 0
      ),
      hasFiveMinuteIntervals: globalTimeStats.allUniqueMinutes.every(
        (m) => m % 5 === 0
      ),
      daysWithMostTimes: detailedDayAnalysis
        .sort((a, b) => b.timesCount - a.timesCount)
        .slice(0, 3)
        .map((day) => ({ date: day.dateFormatted, count: day.timesCount })),
      daysWithLeastTimes: detailedDayAnalysis
        .sort((a, b) => a.timesCount - b.timesCount)
        .slice(0, 3)
        .map((day) => ({ date: day.dateFormatted, count: day.timesCount })),
      timeGaps: detailedDayAnalysis.map((day) => ({
        date: day.dateFormatted,
        hasGaps: day.hourRange
          ? day.hourRange.totalHours * 2 !== day.timesCount
          : false,
        expectedSlots: day.hourRange ? day.hourRange.totalHours * 2 : 0,
        actualSlots: day.timesCount,
      })),
    };

    console.log("🔍 DEBUG: Wzorce i anomalie w danych spotkania", {
      patterns,
      recommendations: {
        tableStructure: patterns.hasOnlyHalfHours
          ? "Tabela 30-minutowa"
          : patterns.hasQuarterHours
          ? "Tabela 15-minutowa"
          : "Tabela dynamiczna",
        potentialIssues: patterns.timeGaps
          .filter((gap) => gap.hasGaps)
          .map(
            (gap) =>
              `${gap.date}: brakuje ${
                gap.expectedSlots - gap.actualSlots
              } slotów czasowych`
          ),
      },
      timestamp: new Date().toISOString(),
    });

    console.log("🔧 OPTYMALIZACJA: Finalne obliczanie flatTimes", {
      totalTimes: times.length,
      firstTimestamp: times[0],
      lastTimestamp: times[times.length - 1],
      firstTimeFormatted:
        times.length > 0 ? moment(times[0]).format("YYYY-MM-DD HH:mm") : "Brak",
      lastTimeFormatted:
        times.length > 0
          ? moment(times[times.length - 1]).format("YYYY-MM-DD HH:mm")
          : "Brak",
      timesSample: times
        .slice(0, 10)
        .map((t) => moment(t).format("YYYY-MM-DD HH:mm")),
      timestamp: new Date().toISOString(),
    });

    return times;
  }, [staticMeetingData.dates, meetingData]);

  // OPTYMALIZACJA: Memoizacja czasu minimum i maximum z dodatkowymi szczegółami
  const timeRange = useMemo(() => {
    if (flatTimes.length === 0) return null;

    console.log("🔧 OPTYMALIZACJA: Rozpoczęcie obliczania timeRange", {
      flatTimesCount: flatTimes.length,
      datesCount: staticMeetingData.dates.length,
      timestamp: new Date().toISOString(),
    });

    // DEBUG: Analiza minimum i maximum dla każdego dnia osobno
    const dailyMinMax = staticMeetingData.dates
      .map((dateObj: any, index: number) => {
        if (!dateObj.times || dateObj.times.length === 0) return null;

        const dayMinTime = Math.min(...dateObj.times);
        const dayMaxTime = Math.max(...dateObj.times);

        const analysis = {
          dayIndex: index,
          date: new Date(dateObj.date).toLocaleDateString("pl-PL"),
          dayName: new Date(dateObj.date).toLocaleDateString("pl-PL", {
            weekday: "long",
          }),
          dayMinTime,
          dayMaxTime,
          minFormatted: moment(dayMinTime).format("YYYY-MM-DD HH:mm"),
          maxFormatted: moment(dayMaxTime).format("YYYY-MM-DD HH:mm"),
          minHour: moment(dayMinTime).hour(),
          minMinute: moment(dayMinTime).minute(),
          maxHour: moment(dayMaxTime).hour(),
          maxMinute: moment(dayMaxTime).minute(),
          timesCount: dateObj.times.length,
          timeSpan: `${moment(dayMinTime).format("HH:mm")} - ${moment(
            dayMaxTime
          ).format("HH:mm")}`,
          allTimesForDay: dateObj.times
            .map((t: number) => ({
              timestamp: t,
              formatted: moment(t).format("HH:mm"),
            }))
            .sort((a: any, b: any) => a.timestamp - b.timestamp),
        };

        console.log(`📅 DEBUG: Min/Max analiza dla dnia ${index + 1}`, {
          ...analysis,
          timeSlots: analysis.allTimesForDay.map((t) => t.formatted),
          timestamp: new Date().toISOString(),
        });

        return analysis;
      })
      .filter(Boolean);

    // Znajdź globalne minimum i maximum - POPRAWKA: Porównuj tylko godziny, nie timestampy
    const allMinTimes = dailyMinMax.map((day) => day.dayMinTime);
    const allMaxTimes = dailyMinMax.map((day) => day.dayMaxTime);

    console.log("📊 DEBUG: Analiza globalnego zakresu czasowego", {
      allMinTimes,
      allMaxTimes,
      // DODAJ: Analiza godzin zamiast timestampów
      hourAnalysis: {
        allMinHours: dailyMinMax.map((day) => ({
          day: day.date,
          hour: day.minHour,
          minute: day.minMinute,
          fullTime: `${day.minHour}:${day.minMinute
            .toString()
            .padStart(2, "0")}`,
        })),
        allMaxHours: dailyMinMax.map((day) => ({
          day: day.date,
          hour: day.maxHour,
          minute: day.maxMinute,
          fullTime: `${day.maxHour}:${day.maxMinute
            .toString()
            .padStart(2, "0")}`,
        })),
      },
      timestamp: new Date().toISOString(),
    });

    // POPRAWKA: Znajdź globalne minimum i maksimum na podstawie GODZIN, nie timestampów
    const globalMinHour = Math.min(...dailyMinMax.map((day) => day.minHour));
    const globalMaxHour = Math.max(...dailyMinMax.map((day) => day.maxHour));

    // POPRAWKA: Znajdź najwcześniejszą minutę dla globalnej minimalnej godziny
    const daysWithMinHour = dailyMinMax.filter(
      (day) => day.minHour === globalMinHour
    );
    const globalMinMinute = Math.min(
      ...daysWithMinHour.map((day) => day.minMinute)
    );

    // POPRAWKA: Znajdź najpóźniejszą minutę dla globalnej maksymalnej godziny
    const daysWithMaxHour = dailyMinMax.filter(
      (day) => day.maxHour === globalMaxHour
    );
    const globalMaxMinute = Math.max(
      ...daysWithMaxHour.map((day) => day.maxMinute)
    );

    // POPRAWKA: Znajdź reprezentatywne timestampy dla globalnych ekstremów
    const dayWithGlobalMinHour = daysWithMinHour.find(
      (day) => day.minMinute === globalMinMinute
    );
    const dayWithGlobalMaxHour = daysWithMaxHour.find(
      (day) => day.maxMinute === globalMaxMinute
    );

    const globalMinTime =
      dayWithGlobalMinHour?.dayMinTime || Math.min(...allMinTimes);
    const globalMaxTime =
      dayWithGlobalMaxHour?.dayMaxTime || Math.max(...allMaxTimes);

    console.log(
      "🌍 DEBUG: Globalne minimum i maksimum czasu spotkania - POPRAWIONA WERSJA",
      {
        // STARA METODA (błędna)
        oldMethod: {
          globalMinTime: Math.min(...allMinTimes),
          globalMaxTime: Math.max(...allMaxTimes),
          globalMinFormatted: moment(Math.min(...allMinTimes)).format(
            "YYYY-MM-DD HH:mm"
          ),
          globalMaxFormatted: moment(Math.max(...allMaxTimes)).format(
            "YYYY-MM-DD HH:mm"
          ),
        },
        // NOWA METODA (poprawna)
        newMethod: {
          globalMinHour,
          globalMaxHour,
          globalMinMinute,
          globalMaxMinute,
          globalMinTime,
          globalMaxTime,
          globalMinFormatted: moment(globalMinTime).format("YYYY-MM-DD HH:mm"),
          globalMaxFormatted: moment(globalMaxTime).format("YYYY-MM-DD HH:mm"),
          globalHourRange: `${globalMinHour}:${globalMinMinute
            .toString()
            .padStart(2, "0")} - ${globalMaxHour}:${globalMaxMinute
            .toString()
            .padStart(2, "0")}`,
        },
        // SZCZEGÓŁY ŹRÓDEŁ
        sources: {
          minHourSources: daysWithMinHour.map((day) => ({
            day: day.date,
            hour: day.minHour,
            minute: day.minMinute,
            timestamp: day.dayMinTime,
          })),
          maxHourSources: daysWithMaxHour.map((day) => ({
            day: day.date,
            hour: day.maxHour,
            minute: day.maxMinute,
            timestamp: day.dayMaxTime,
          })),
          selectedMinSource: dayWithGlobalMinHour
            ? {
                day: dayWithGlobalMinHour.date,
                time: `${
                  dayWithGlobalMinHour.minHour
                }:${dayWithGlobalMinHour.minMinute
                  .toString()
                  .padStart(2, "0")}`,
                timestamp: dayWithGlobalMinHour.dayMinTime,
              }
            : null,
          selectedMaxSource: dayWithGlobalMaxHour
            ? {
                day: dayWithGlobalMaxHour.date,
                time: `${
                  dayWithGlobalMaxHour.maxHour
                }:${dayWithGlobalMaxHour.maxMinute
                  .toString()
                  .padStart(2, "0")}`,
                timestamp: dayWithGlobalMaxHour.dayMaxTime,
              }
            : null,
        },
        timestamp: new Date().toISOString(),
      }
    );

    // Znajdź które dni mają globalne extrema - POPRAWIONA WERSJA
    const dayWithGlobalMin = dayWithGlobalMinHour;
    const dayWithGlobalMax = dayWithGlobalMaxHour;

    console.log(
      "⚖️ DEBUG: Porównanie metod obliczania globalnego zakresu - POPRAWIONA WERSJA",
      {
        methodComparison: {
          flatTimesMethod: {
            minTime: Math.min(...flatTimes),
            maxTime: Math.max(...flatTimes),
            minFormatted: moment(Math.min(...flatTimes)).format(
              "YYYY-MM-DD HH:mm"
            ),
            maxFormatted: moment(Math.max(...flatTimes)).format(
              "YYYY-MM-DD HH:mm"
            ),
            minHour: moment(Math.min(...flatTimes)).hour(),
            maxHour: moment(Math.max(...flatTimes)).hour(),
          },
          timestampAnalysisMethod: {
            minTime: Math.min(...allMinTimes),
            maxTime: Math.max(...allMaxTimes),
            minFormatted: moment(Math.min(...allMinTimes)).format(
              "YYYY-MM-DD HH:mm"
            ),
            maxFormatted: moment(Math.max(...allMaxTimes)).format(
              "YYYY-MM-DD HH:mm"
            ),
            minHour: moment(Math.min(...allMinTimes)).hour(),
            maxHour: moment(Math.max(...allMaxTimes)).hour(),
          },
          // NOWA POPRAWNA METODA
          hourComparisonMethod: {
            minTime: globalMinTime,
            maxTime: globalMaxTime,
            minFormatted: moment(globalMinTime).format("YYYY-MM-DD HH:mm"),
            maxFormatted: moment(globalMaxTime).format("YYYY-MM-DD HH:mm"),
            minHour: globalMinHour,
            maxHour: globalMaxHour,
            minMinute: globalMinMinute,
            maxMinute: globalMaxMinute,
          },
        },
        extremaSources: {
          globalMinFrom: dayWithGlobalMin
            ? {
                day: dayWithGlobalMin.date,
                dayName: dayWithGlobalMin.dayName,
                time: dayWithGlobalMin.minFormatted,
                hour: dayWithGlobalMin.minHour,
                minute: dayWithGlobalMin.minMinute,
              }
            : null,
          globalMaxFrom: dayWithGlobalMax
            ? {
                day: dayWithGlobalMax.date,
                dayName: dayWithGlobalMax.dayName,
                time: dayWithGlobalMax.maxFormatted,
                hour: dayWithGlobalMax.maxHour,
                minute: dayWithGlobalMax.maxMinute,
              }
            : null,
        },
        dailyRanges: dailyMinMax.map((day) => ({
          date: day.date,
          range: day.timeSpan,
          timesCount: day.timesCount,
          hourRange: `${day.minHour}:${day.minMinute
            .toString()
            .padStart(2, "0")} - ${day.maxHour}:${day.maxMinute
            .toString()
            .padStart(2, "0")}`,
        })),
        timestamp: new Date().toISOString(),
      }
    );

    const result = {
      minTime: globalMinTime,
      maxTime: globalMaxTime,
      minimumTimeHour: globalMinHour, // POPRAWKA: Użyj globalMinHour zamiast moment(globalMinTime).hour()
      maximumTimeHour: globalMaxHour, // POPRAWKA: Użyj globalMaxHour zamiast moment(globalMaxTime).hour()
      isMinimumTimeHalfHour: globalMinMinute === 30, // POPRAWKA: Użyj globalMinMinute
      isMaximumTimeHalfHour: globalMaxMinute === 30, // POPRAWKA: Użyj globalMaxMinute
    };

    console.log(
      "🔧 OPTYMALIZACJA: Finalne obliczanie zakresu czasu - POPRAWIONA WERSJA",
      {
        result,
        detailedBreakdown: {
          globalMinTime: {
            timestamp: globalMinTime,
            formatted: moment(globalMinTime).format("YYYY-MM-DD HH:mm:ss"),
            hour: result.minimumTimeHour,
            minute: globalMinMinute, // POPRAWKA: Użyj globalMinMinute
            isHalfHour: result.isMinimumTimeHalfHour,
            sourceDay: dayWithGlobalMin?.date,
          },
          globalMaxTime: {
            timestamp: globalMaxTime,
            formatted: moment(globalMaxTime).format("YYYY-MM-DD HH:mm:ss"),
            hour: result.maximumTimeHour,
            minute: globalMaxMinute, // POPRAWKA: Użyj globalMaxMinute
            isHalfHour: result.isMaximumTimeHalfHour,
            sourceDay: dayWithGlobalMax?.date,
          },
          hourSpan: {
            from: `${result.minimumTimeHour}:${
              result.isMinimumTimeHalfHour ? "30" : "00"
            }`,
            to: `${result.maximumTimeHour}:${
              result.isMaximumTimeHalfHour ? "30" : "00"
            }`,
            totalHours: result.maximumTimeHour - result.minimumTimeHour + 1,
            expectedTableRows:
              (result.maximumTimeHour - result.minimumTimeHour + 1) * 2,
          },
        },
        qualityCheck: {
          hasValidRange: result.maximumTimeHour >= result.minimumTimeHour,
          hourSpanReasonable:
            result.maximumTimeHour - result.minimumTimeHour <= 24,
          coversAllDays: dailyMinMax.every(
            (day) =>
              day.minHour >= result.minimumTimeHour &&
              day.maxHour <= result.maximumTimeHour
          ),
        },
        timestamp: new Date().toISOString(),
      }
    );

    return result;
  }, [flatTimes, staticMeetingData.dates]);

  React.useEffect(() => {
    console.log("🚀 DEBUG AnswerMeeting: Inicjalizacja komponentu", {
      meetingData: {
        meetName: staticMeetingData.meetName,
        appointmentId: staticMeetingData.appointmentId,
        datesCount: staticMeetingData.dates?.length || 0,
        answersCount: meetingData.answers?.length || 0,
      },
      session: session
        ? {
            isLoggedIn: true,
            username: session.user?.name,
          }
        : { isLoggedIn: false },
      lang,
      pathname,
      timestamp: new Date().toISOString(),
    });
  }, []); // OPTYMALIZACJA: Uruchamiany tylko raz

  const [selectedTimecells, setSelectedTimecells] = useState<MeetingDate[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [lookedUpDatetime, setLookedUpDatetime] = useState<number>();
  const [lookedUpDate, setLookedUpDate] = useState<string>();
  const [lookedUpTime, setLookedUpTime] = useState<string>();
  const [answers, setAnswers] = useState<any>(meetingData.answers);
  const [meetName, setMeetName] = useState(staticMeetingData.meetName);
  const [highestAvailableCount, setHighestAvailableCount] = useState(0);
  const [mobileAnsweringMode, setMobileAnsweringMode] = useState(true);
  const [onlineSelectionMode, setOnlineSelectionMode] = useState(false);
  const [unselectMode, setUnselectMode] = useState(false);
  const [isSendingReq, setIsSendingReq] = useState(false);

  class MeetingDate {
    meetDate: number;
    isOnline: boolean;

    constructor(meetDate: number, isOnline: boolean) {
      this.meetDate = meetDate;
      this.isOnline = isOnline;
    }
  }

  const isUserLoggedIn = !!session?.user;
  const [username, setUsername] = useState(
    isUserLoggedIn ? session.user.name : ""
  );
  const [availableCount, setAvailableCount] = useState(0);

  // OPTYMALIZACJA: Memoizacja sprawdzania mobile
  const isMobile = useMediaQuery({
    query: "(max-width: 1023px)",
  });

  const isMouseDown = useMouseDown();

  // OPTYMALIZACJA: Memoizacja availabilityInfo
  const availabilityInfo = useMemo(() => {
    const info = getAvailabilityInfo(answers);
    console.log("🔧 OPTYMALIZACJA: Obliczanie availabilityInfo", {
      answersCount: answers.length,
      availabilityKeysCount: Object.keys(info).length,
      timestamp: new Date().toISOString(),
    });
    return info;
  }, [answers]);

  const [toggleButtonName, setToggleButtonName] = useState(
    dict.page.answerMeeting.toggleButton.showAvailability
  );

  // OPTYMALIZACJA: useCallback dla często używanych funkcji
  const toggleAnsweringMode = useCallback(() => {
    console.log("🔄 DEBUG AnswerMeeting: Przełączanie trybu odpowiadania");
    setMobileAnsweringMode((prevMode) => !prevMode);
    setToggleButtonName((prevMode) =>
      prevMode === mobileAnsweringMode
        ? dict.page.answerMeeting.toggleButton.answerMeeting
        : dict.page.answerMeeting.toggleButton.showAvailability
    );
  }, [dict, mobileAnsweringMode]);

  const isDateSelected = useCallback(
    (dateTime: number) =>
      selectedTimecells.some(
        (meetDateInfo) => meetDateInfo.meetDate === dateTime
      ),
    [selectedTimecells]
  );

  const getSelectedTimecell = useCallback(
    (dateTime: number) =>
      selectedTimecells.find(
        (meetDateInfo) => meetDateInfo.meetDate === dateTime
      ),
    [selectedTimecells]
  );

  const updateTimecell = useCallback((dateTime: number, isOnline: boolean) => {
    console.log("🔄 DEBUG AnswerMeeting: Aktualizacja komórki czasowej", {
      datetime: new Date(dateTime).toLocaleString(),
      isOnline,
    });

    setSelectedTimecells((prevTimecells) => {
      const updatedTimecells = prevTimecells.map((meetDateInfo) =>
        meetDateInfo.meetDate === dateTime
          ? { ...meetDateInfo, isOnline }
          : meetDateInfo
      );
      return updatedTimecells;
    });
  }, []);

  const unselectTimecell = useCallback(
    (dateTime: number) => {
      console.log("❌ DEBUG AnswerMeeting: Odznaczanie komórki czasowej", {
        datetime: new Date(dateTime).toLocaleString(),
        isMobile,
      });

      if (!isMobile) {
        setUnselectMode(true);
      }
      setSelectedTimecells(
        selectedTimecells.filter(
          (meetDateInfo) => meetDateInfo.meetDate !== dateTime
        )
      );
    },
    [selectedTimecells, isMobile]
  );

  const toggleTimecell = useCallback(
    (dateTime: number) => {
      const isSelected = isDateSelected(dateTime);
      const selectedTimecell = getSelectedTimecell(dateTime);

      console.log("🔀 DEBUG AnswerMeeting: toggleTimecell", {
        datetime: new Date(dateTime).toLocaleString(),
        isSelected,
        selectionMode,
        onlineSelectionMode,
        unselectMode,
      });

      if (isSelected) {
        if (!selectionMode) {
          if (selectedTimecell?.isOnline) {
            unselectTimecell(dateTime);
            setOnlineSelectionMode(false);
          } else if (!selectedTimecell?.isOnline) {
            setOnlineSelectionMode(true);
            updateTimecell(dateTime, true);
          }
        } else {
          if (!unselectMode) {
            if (onlineSelectionMode && !selectedTimecell?.isOnline) {
              updateTimecell(dateTime, true);
            } else if (!onlineSelectionMode && selectedTimecell?.isOnline) {
              updateTimecell(dateTime, false);
            }
          } else {
            unselectTimecell(dateTime);
          }
        }
      } else if (!unselectMode) {
        const meetDateInfo = new MeetingDate(dateTime, onlineSelectionMode);
        setSelectedTimecells([...selectedTimecells, meetDateInfo]);
      }
    },
    [
      isDateSelected,
      getSelectedTimecell,
      selectionMode,
      onlineSelectionMode,
      unselectMode,
      selectedTimecells,
      unselectTimecell,
      updateTimecell,
    ]
  );

  const disableSelection = useCallback(() => {
    if (!isMouseDown) {
      console.log("🔒 DEBUG AnswerMeeting: Wyłączanie trybu selekcji");
      setSelectionMode(false);
      setUnselectMode(false);
      setOnlineSelectionMode(false);
    }
  }, [isMouseDown]);

  const convertDatetimeToDate = useCallback((datetime: number) => {
    const date = moment(datetime);
    const convertedDate = date.format("DD.MM");
    const convertedDayName = _.capitalize(date.format("dddd"));
    const convertedTime = date.format("HH:mm");
    setLookedUpDate(`${convertedDate} ${convertedDayName}`);
    setLookedUpTime(convertedTime);

    console.log("👀 DEBUG AnswerMeeting: Podgląd daty/czasu", {
      datetime,
      formattedDateTime: `${convertedDate} ${convertedDayName} ${convertedTime}`,
    });
  }, []);

  const isAnswered = useCallback(
    (datetime: number) =>
      answers.some((answer: any) =>
        answer.dates.some((date: any) => date.meetDate === datetime)
      ),
    [answers]
  );

  // OPTYMALIZACJA: Memoizacja nagłówków dni
  const daysHeadings = useMemo(() => {
    console.log("🔧 OPTYMALIZACJA: Renderowanie nagłówków dni");

    return staticMeetingData.dates.map((day: any) => {
      const dateMoment = moment(day.date);
      const date = dateMoment.date();
      const month = dateMoment.month() + 1;
      const dayOfWeek = dateMoment.day();
      const classNames = dayOfWeek === 0 ? "pr-4" : "";

      return (
        <th
          key={day.date}
          className={`bg-light sticky top-0 z-10 ${classNames}`}
        >
          <p className="text-sm text-dark font-medium">
            {`${date.toString().padStart(2, "0")}.${month
              .toString()
              .padStart(2, "0")}`}
          </p>
          <p className="text-dark">{_.capitalize(dateMoment.format("ddd"))}</p>
        </th>
      );
    });
  }, [staticMeetingData.dates]);

  // OPTYMALIZACJA: Memoizacja komórki dostępnej
  const availableTimecell = useCallback(
    (dateTime: number, isEndOfWeek: boolean) => {
      const isMobileAnsweringMode = isMobile && mobileAnsweringMode;
      const isDesktop = !isMobile;
      const selectedTimecell = getSelectedTimecell(dateTime);
      const dateVotes = availabilityInfo[dateTime]?.usersInfo.length || 0;
      const isSelected = isDateSelected(dateTime);
      const isAnsweredDate = isAnswered(dateTime);

      const handleMouseDown = () => {
        if ((isMobileAnsweringMode || isDesktop) && !unselectMode) {
          toggleTimecell(dateTime);
        } else if (!isMobileAnsweringMode && !isDesktop && !unselectMode) {
          setLookedUpDatetime(dateTime);
          convertDatetimeToDate(dateTime);
        }
        if (isDesktop) {
          setSelectionMode(true);
        }
      };

      const handleMouseUp = () => {
        if (isDesktop) {
          setSelectionMode(false);
          setUnselectMode(false);
        }
      };

      const handleMouseOver = () => {
        if (selectionMode) {
          toggleTimecell(dateTime);
        }
        setLookedUpDatetime(dateTime);
        convertDatetimeToDate(dateTime);
        disableSelection();
      };

      return (
        <td key={dateTime}>
          <div
            data-date={dateTime}
            date-votes={dateVotes}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseOver={handleMouseOver}
            className={`rounded-lg h-12 w-24 lg:h-6 lg:w-12 transition-colors ${
              isEndOfWeek && "mr-4"
            } ${
              isAnsweredDate
                ? `border-none ${
                    isSelected
                      ? `${
                          selectedTimecell?.isOnline
                            ? `bg-gold ${!isMobile && "hover:bg-gold/50"}`
                            : `bg-primary ${!isMobile && "hover:bg-primary/50"}`
                        } selected`
                      : `answered  ${
                          !isMobile && "active:animate-cell-select"
                        } ${
                          availabilityInfo[dateTime].onlineCount >=
                            highestAvailableCount * 0.5 &&
                          availabilityInfo[dateTime].usersInfo.length ==
                            highestAvailableCount
                            ? `bg-gold-dark ${
                                !isMobile && "hover:bg-gold-dark/50"
                              }`
                            : availabilityInfo[dateTime].usersInfo.length ==
                              highestAvailableCount
                            ? `bg-green ${!isMobile && "hover:bg-green/50"}`
                            : `bg-light-green ${
                                !isMobile && "hover:bg-light-green/50"
                              }`
                        }`
                  }`
                : `border border-gray ${!isMobile && "hover:border-gray/50"} ${
                    isSelected
                      ? `border-none ${
                          selectedTimecell?.isOnline
                            ? `bg-gold ${!isMobile && "hover:bg-gold/50"}`
                            : `bg-primary ${!isMobile && "hover:bg-primary/50"}`
                        }`
                      : `${
                          (isMobileAnsweringMode || isDesktop) &&
                          !isMobile &&
                          !unselectMode &&
                          "hover:border-none active:animate-cell-select hover:bg-primary"
                        }`
                  }`
            }`}
          ></div>
        </td>
      );
    },
    [
      isMobile,
      mobileAnsweringMode,
      getSelectedTimecell,
      availabilityInfo,
      isDateSelected,
      isAnswered,
      unselectMode,
      selectionMode,
      toggleTimecell,
      convertDatetimeToDate,
      disableSelection,
      highestAvailableCount,
    ]
  );

  // OPTYMALIZACJA: Memoizacja komórek czasowych - główna optymalizacja!
  const timeCells = useMemo(() => {
    if (!timeRange) return [];

    console.log("🔧 OPTYMALIZACJA: Renderowanie komórek czasowych", {
      minimumTimeHour: timeRange.minimumTimeHour,
      maximumTimeHour: timeRange.maximumTimeHour,
      timestamp: new Date().toISOString(),
    });

    const disabledTimecell = () => (
      <td>
        <div className="rounded-lg h-12 w-24 lg:h-6 lg:w-12 bg-light-gray cursor-default"></div>
      </td>
    );

    var cells: JSX.Element[] = [];

    for (
      let i = timeRange.minimumTimeHour;
      i <= timeRange.maximumTimeHour;
      i++
    ) {
      for (let h = 0; h < 2; h++) {
        const isHalfHour = h === 1;

        if (
          i == timeRange.maximumTimeHour &&
          isHalfHour &&
          !timeRange.isMaximumTimeHalfHour
        ) {
          break;
        }

        if (
          i == timeRange.minimumTimeHour &&
          !isHalfHour &&
          timeRange.isMinimumTimeHalfHour
        ) {
          continue;
        }

        let timeRow: JSX.Element[] = [];
        let validTimesInRow = 0;

        for (const date of staticMeetingData.dates) {
          const dateTime = moment(date.date)
            .hour(i)
            .minute(isHalfHour ? 30 : 0)
            .valueOf();

          const isEndOfWeek = moment(dateTime).day() == 0;
          const isTimeAvailable = flatTimes.includes(dateTime);

          if (isTimeAvailable) {
            validTimesInRow++;
          }

          const cellComponent = isTimeAvailable
            ? availableTimecell(dateTime, isEndOfWeek)
            : disabledTimecell();
          timeRow.push(cellComponent);

          const usersInfoCount =
            availabilityInfo[dateTime]?.usersInfo.length || 0;
          if (usersInfoCount > highestAvailableCount) {
            setHighestAvailableCount(
              availabilityInfo[dateTime].usersInfo.length
            );
          }
        }

        cells.push(
          <tr
            key={`${i}${isHalfHour ? "30" : "00"}`}
            className="cursor-pointer"
          >
            {((h === 0 &&
              !(
                i === timeRange.minimumTimeHour &&
                timeRange.isMinimumTimeHalfHour
              )) ||
              (h === 1 &&
                i === timeRange.minimumTimeHour &&
                timeRange.isMinimumTimeHalfHour) ||
              (h === 1 &&
                i === timeRange.maximumTimeHour &&
                !timeRange.isMaximumTimeHalfHour)) && (
              <th
                rowSpan={isHalfHour ? 1 : 2}
                className="text-right text-dark align-top bg-light sticky left-0 pr-2"
              >
                {i === timeRange.minimumTimeHour &&
                timeRange.isMinimumTimeHalfHour
                  ? `${i.toString().padStart(2, "0")}:30`
                  : isHalfHour
                  ? `${i.toString().padStart(2, "0")}:30`
                  : `${i.toString().padStart(2, "0")}:00`}
              </th>
            )}
            {timeRow}
          </tr>
        );
      }
    }

    if (timeRange.isMaximumTimeHalfHour) {
      const endHour = timeRange.maximumTimeHour + 1;
      cells.push(
        <tr key={`${endHour}00`} className="cursor-pointer">
          <th className="text-right text-dark align-bottom bg-light sticky left-0 pr-2">
            {`${endHour.toString().padStart(2, "0")}:00`}
          </th>
        </tr>
      );
    }

    console.log("✅ OPTYMALIZACJA: Zakończono renderowanie tabeli", {
      totalRows: cells.length,
      timestamp: new Date().toISOString(),
    });

    return cells;
  }, [
    timeRange,
    staticMeetingData.dates,
    flatTimes,
    availableTimecell,
    availabilityInfo,
    highestAvailableCount,
  ]); // KLUCZOWA OPTYMALIZACJA: Memoizacja całej tabeli

  // OPTYMALIZACJA: Funkcje wysyłania z useCallback
  const clearFormData = useCallback(() => {
    setUsername("");
    setSelectedTimecells([]);
  }, []);

  const sendAnswer: SubmitHandler<any> = useCallback(async () => {
    try {
      console.log("📤 DEBUG AnswerMeeting: Wysyłanie odpowiedzi");
      if (isSendingReq || !username) return;

      setIsSendingReq(true);

      const answerResponse = await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/meet/${staticMeetingData.appointmentId}`,
        { username, dates: selectedTimecells }
      );

      if (answerResponse.status !== 200) return;

      const updatedMeetResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/meet/${staticMeetingData.appointmentId}`
      );

      if (updatedMeetResponse.status === 200) {
        setAnswers(updatedMeetResponse.data.answers);
        setMeetName(updatedMeetResponse.data.meetName);
        clearFormData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSendingReq(false);
    }
  }, [
    isSendingReq,
    username,
    selectedTimecells,
    staticMeetingData.appointmentId,
    clearFormData,
  ]);

  const sendAnswerLoggedIn = useCallback(async () => {
    try {
      console.log("📤 DEBUG AnswerMeeting: Wysyłanie odpowiedzi (zalogowany)");
      if (isSendingReq) return;

      setIsSendingReq(true);

      const answerResponse = await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/meet/${staticMeetingData.appointmentId}`,
        { username, dates: selectedTimecells }
      );

      if (answerResponse.status !== 200) return;

      const updatedMeetResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/meet/${staticMeetingData.appointmentId}`
      );

      if (updatedMeetResponse.status === 200) {
        setAnswers(updatedMeetResponse.data.answers);
        setMeetName(updatedMeetResponse.data.meetName);
        setSelectedTimecells([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSendingReq(false);
    }
  }, [
    isSendingReq,
    username,
    selectedTimecells,
    staticMeetingData.appointmentId,
  ]);

  // OPTYMALIZACJA: Efekt tylko dla dostępności
  useEffect(() => {
    if (lookedUpDatetime && availabilityInfo[lookedUpDatetime]) {
      setAvailableCount(availabilityInfo[lookedUpDatetime].usersInfo.length);
    } else {
      setAvailableCount(0);
    }
  }, [lookedUpDatetime, availabilityInfo]);

  // OPTYMALIZACJA: Memoizacja informacji o dostępności
  const availabilityInfoContent = useMemo(() => {
    if (!lookedUpDatetime) {
      return isMobile ? (
        <span>{dict.page.answerMeeting.clickToReveal}</span>
      ) : (
        <span>{dict.page.answerMeeting.hoverToReveal}</span>
      );
    }

    if (!availabilityInfo[lookedUpDatetime]) {
      return (
        <span className="text-dark">
          {dict.page.answerMeeting.nobodyAvailable}
        </span>
      );
    }

    const dayAvailabilityInfo = availabilityInfo[lookedUpDatetime];
    const availableUsers = dayAvailabilityInfo?.usersInfo;

    availableUsers?.sort((a: any, b: any) =>
      a.userData.username.localeCompare(b.userData.username)
    );

    const onlineAvailableUsers = availableUsers?.filter(
      (user: any) => user.isOnline === true
    );

    const listOfOnlineAvailableUsers = onlineAvailableUsers?.map(
      (userData: any) => (
        <li key={userData.userData.userId} className="flex items-center">
          <span className="block h-3 w-3 rounded-full bg-gold mr-2"></span>
          <span>{userData.userData.username}</span>
        </li>
      )
    );

    const offlineAvailableUsers = availableUsers?.filter(
      (user: any) => user.isOnline === false
    );

    const listOfOfflineAvailableUsers = offlineAvailableUsers?.map(
      (userData: any) => (
        <li key={userData.userData.userId} className="flex items-center">
          <span className="block h-3 w-3 rounded-full bg-primary mr-2"></span>
          <span>{userData.userData.username}</span>
        </li>
      )
    );

    const unavailableUsers = getUnavailableUsersInfo(answers, availableUsers);

    const listOfUnavailableUsers = unavailableUsers?.map((userData: any) => (
      <li key={userData._id} className="text-gray flex items-center">
        <span className="block h-3 w-3 rounded-full bg-gray mr-2"></span>
        <s>{userData.username}</s>
      </li>
    ));

    return (
      <ul>
        {listOfOnlineAvailableUsers}
        {listOfOfflineAvailableUsers}
        {listOfUnavailableUsers}
      </ul>
    );
  }, [lookedUpDatetime, availabilityInfo, answers, isMobile, dict]);

  // Forms
  const formSchema = yup.object().shape({
    name: yup
      .string()
      .required(dict.page.answerMeeting.validate.name.required)
      .max(20, dict.page.answerMeeting.validate.name.max),
  });

  type Inputs = {
    name: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(formSchema),
  });

  return (
    <main className="flex md:flex-1 flex-col px-5 py-10 pt-24 lg:p-24 lg:pt-28 h-smd:pt-30 lg:m-0 w-[356px] md:w-auto lg:w-[900px]">
      <Title text={meetName} />
      {/* Meeting details */}
      {(staticMeetingData.meetPlace || staticMeetingData.meetLink) && (
        <div className="mb-10">
          {staticMeetingData.meetPlace && (
            <p className="text-dark">🏢 {staticMeetingData.meetPlace}</p>
          )}
          {staticMeetingData.meetLink && (
            <p>
              🔗{" "}
              <LinkButton
                href={staticMeetingData.meetLink}
                text="Link do spotkania"
              />
            </p>
          )}
        </div>
      )}

      {/* Meeting data */}
      <div className="flex flex-1 lg:flex-none items-center lg:items-start flex-col-reverse justify-end lg:justify-start lg:flex-row">
        {(!mobileAnsweringMode && isMobile) || !isMobile ? (
          <section className="availability__info w-full lg:w-1/2 lg:mr-10">
            <p className="text-dark">
              {lookedUpDate} {lookedUpTime}
            </p>
            {lookedUpDate && (
              <Heading text={`${availableCount}/${answers.length}`} />
            )}
            <div
              className={`overflow-auto ${
                isMobile && "max-h-[100px]"
              } h-hd:max-h-[300px]`}
            >
              {availabilityInfoContent}
            </div>
          </section>
        ) : null}

        <section className="flex flex-col time__selection lg:w-1/2">
          {isMobile && (
            <div className="flex items-center justify-center mb-5">
              <Button text={toggleButtonName} onClick={toggleAnsweringMode} />
            </div>
          )}

          <form
            className="flex flex-1 flex-col place-content-start items-center"
            onSubmit={
              isUserLoggedIn ? sendAnswerLoggedIn : handleSubmit(sendAnswer)
            }
          >
            <div className="flex flex-col-reverse lg:flex-col items-center lg:items-start">
              {((mobileAnsweringMode && isMobile) || !isMobile) &&
                !isUserLoggedIn && (
                  <div>
                    <Input
                      label={dict.page.answerMeeting.input.name.label}
                      type="text"
                      id="name"
                      register={register}
                      error={errors.name ? true : false}
                      errorText={errors.name?.message?.toString()}
                      onChange={(e) => setUsername(e.target.value)}
                      value={username}
                      placeholder={
                        dict.page.answerMeeting.input.name.placeholder
                      }
                      name="name"
                      autocomplete="name"
                    />
                  </div>
                )}
              <div
                className={`self-center overflow-auto max-h-[300px] h-md:max-h-[350px] h-mdl:max-h-[400px] h-hd:max-h-[400px] md:h-lg:max-h-[600px] lg:max-h-[300px] w-auto max-w-[365px] md:max-w-[700px] lg:max-w-[350px] pr-3 ${
                  !isUserLoggedIn && "mt-5"
                } ${isMobile && "mb-10"}`}
              >
                <table className="time__seclection--table w-fit lg:mt-5 self-center select-none">
                  <thead>
                    <tr>
                      <th className="bg-light sticky top-0 left-0 z-20"></th>
                      {daysHeadings}
                    </tr>
                  </thead>
                  <tbody>{timeCells}</tbody>
                </table>
              </div>
            </div>
            {(mobileAnsweringMode && isMobile) || !isMobile ? (
              <div>
                <div className="mr-6 inline">
                  <Popup
                    trigger={
                      <button
                        type="button"
                        className="bg-primary hover:bg-primary-hover active:bg-primary-active text-light font-medium h-6 w-6 rounded-full transition-colors"
                      >
                        ?
                      </button>
                    }
                    modal
                    nested
                    closeOnDocumentClick
                  >
                    <div className="p-2 text-dark">
                      <p>
                        {dict.page.answerMeeting.help_popup.line1.segment1}
                        <span className="font-medium">
                          {dict.page.answerMeeting.help_popup.line1.segment2}
                        </span>
                        {dict.page.answerMeeting.help_popup.line1.segment3}
                      </p>
                      <p className="mb-2">
                        {dict.page.answerMeeting.help_popup.line2}
                      </p>
                      <p className="font-medium">
                        {dict.page.answerMeeting.help_popup.showMode.title}
                      </p>
                      <p className="flex items-center">
                        <span className="block h-4 w-4 rounded-full bg-primary mr-2"></span>
                        {dict.page.answerMeeting.help_popup.showMode.green}
                      </p>
                      <p className="flex items-center mb-2">
                        <span className="block h-4 w-4 rounded-full bg-gold mr-2"></span>
                        {dict.page.answerMeeting.help_popup.showMode.gold}
                      </p>
                      <p className="font-medium">
                        {dict.page.answerMeeting.help_popup.answerMode.title}
                      </p>
                      <p className="flex items-center">
                        <span className="block h-4 w-4 rounded-full bg-green mr-2"></span>
                        {dict.page.answerMeeting.help_popup.answerMode.green}
                      </p>
                      <p className="flex items-center">
                        <span className="block h-4 w-4 rounded-full bg-gold mr-2"></span>
                        {dict.page.answerMeeting.help_popup.answerMode.gold}
                      </p>
                      <p className="flex items-center">
                        <span className="block h-4 w-4 rounded-full bg-light-green mr-2"></span>
                        {
                          dict.page.answerMeeting.help_popup.answerMode
                            .lightGreen
                        }
                      </p>
                    </div>
                  </Popup>
                </div>

                <Button text={dict.page.answerMeeting.button.submit} />
                <CopyLinkButton link={pathname} dict={dict} className="ml-6" />
              </div>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}
