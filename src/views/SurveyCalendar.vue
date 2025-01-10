<!--
  Author: 배수호
  Description: FullCalendar를 이용한 설문 일정 표시 컴포넌트
  - 설문 데이터에 맞춰 FullCalendar 캘린더에 이벤트를 표시
  - 각 이벤트 클릭 시 해당 설문 통계 페이지로 이동
  - 캘린더 높이 및 너비 자동 조정, 다양한 색상으로 이벤트 표시
-->

<template>
  <div class="calendar-wrapper">
    <div>
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { surveyAPI } from "@/service/surveyService";

export default {
  components: {
    FullCalendar,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin],
        initialView: "dayGridMonth",
        locale: "ko",
        width: "100%", // 100%로 변경
        maxWidth: "980px", // 최대 너비 명시
        height: "auto", // 캘린더 높이를 자동으로 조정
        expandRows: false, // 행 높이 확장 비활성화
        headerToolbar: {
          left: "title",
          center: "",
          right: "today prev,next",
        },
        events: [], // 목데이터 사용
        eventColor: "#4caf50",
        eventTextColor: "#ffffff",
        eventClick: this.handleEventClick,

        // dayMaxEventRows: true, // 셀 높이 제한을 설정
        // moreLinkContent: "... 더보기", // "더 보기" 버튼 커스터마이즈
      },
    };
  },
  methods: {
    async fetchSurveyData() {
      try {
        const response = await surveyAPI.getCalendarSurvey();

        if (response.data.success && response.data.body) {
          this.calendarOptions.events = response.data.body.map(
            (survey, index) => ({
              id: survey.id,
              title: survey.title,
              start: survey.startAt.split("T")[0], // 'T' 이전의 날짜 부분만 사용
              end: survey.endAt.split("T")[0], // 'T' 이전의 날짜 부분만 사용
              allDay: true,
              color: this.getEventColor(index),
            })
          );
        }
      } catch (error) {
        console.error("Error fetching survey data:", error);
      }
    },

    // 이벤트 색상을 번갈아가며 다르게 설정
    getEventColor(index) {
      const colors = [
        "#FFFAC3",
        "#FEE4CB",
        "#E9D0E5",
        "#D1E2F4",
        "#D9C6BA",
        "F9C8CB",
        "#CCE6BF",
      ];
      return colors[index % colors.length]; // 배열에서 순서대로 색상 사용
    },

    // 이벤트 클릭 시 SurveyEdit 페이지로 이동
    handleEventClick(info) {
      // 클릭된 이벤트의 ID를 통해 SurveyEdit 페이지로 이동
      const surveyId = info.event.id;
      this.$router.push({ name: "SurveyStats", params: { id: surveyId } });
    },
  },
  mounted() {
    this.fetchSurveyData(); // 컴포넌트가 마운트되면 데이터를 가져옴
  },
};
</script>

<style>
/* 전체 캘린더 감싸는 박스 */
.calendar-wrapper {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* FullCalendar 기본 스타일 수정 */
.fc {
  width: 100%;
  max-width: 1100px;
  max-height: 800px;
  margin: 0 auto;
}

/* FullCalendar의 내부 스크롤을 허용 */
.fc-daygrid-body {
  max-height: 550px !important;
  height: 550px !important;
  overflow-y: auto !important;
  overflow-x: hidden;
}

/* 날짜 셀 높이를 강제로 고정 */
.fc-daygrid-day-frame {
  min-height: 90px !important;
  height: auto !important;
  overflow: visible !important;
}

/* 캘린더 헤더 스타일 */
.fc .fc-toolbar.fc-header-toolbar {
  padding: 10px 14px 10px 24px;
  font-size: 12px;
  font-weight: 500;
  background: #dfe7ef;
  border-radius: 16px;
}

.fc .fc-toolbar-title {
  font-size: 1.1rem;
  font-weight: bold;
}

.fc .fc-button {
  border: none;
  background-color: transparent;
  color: #000;
  font-size: 0.95rem;
  cursor: pointer;
}

/* 달력 넘기는 버튼 포커스 및 클릭 시 테두리 제거 */
.fc .fc-button:focus {
  outline: none !important;
  box-shadow: none !important;
}

/* today 버튼 */
.fc .fc-button:disabled,
.fc .fc-button:not(:disabled) {
  background-color: white;
  color: #000;
  font-weight: bold;
  border-radius: 6px;
  padding: 5px 18px;
}

.fc .fc-button:disabled {
  font-weight: bold;
  background-color: #f7f9fc;
}

.fc-direction-ltr .fc-button-group > .fc-button:not(:first-child),
.fc-direction-ltr .fc-button-group > .fc-button:not(:last-child) {
  padding: 5px;
  background-color: transparent;
}

/* 날짜 셀 높이를 고정 */
.fc-daygrid-day-frame {
  min-height: 90px !important;
  height: auto !important;
  overflow: visible !important;
}

.fc-daygrid-day {
  height: auto !important;
}

.fc-daygrid-day-number {
  font-size: 1rem;
  font-weight: bold;
  color: #555;
}

/* 오늘 날짜 강조 */
.fc-day-today {
  background-color: #e8f5e9;
}

/* 이벤트 스타일 */
.fc-event {
  border: none;
  border-radius: 8px;
  padding: 4px 12px;
  margin-bottom: 5px;
}

/* 이벤트 컨테이너 */
.fc-daygrid-day-events {
  max-height: none;
  overflow: visible;
}

.fc-sticky {
  color: #000;
}

.fc .fc-daygrid-day.fc-day-today {
  background-color: #dfe7ef;
}

.fc-day-sun a {
  color: red;
}

/* 스크롤바 스타일링 */
.fc-daygrid-body::-webkit-scrollbar {
  display: none;
}
</style>
