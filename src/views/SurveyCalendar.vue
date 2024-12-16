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
        width: '100%', // 100%로 변경
        maxWidth: '980px', // 최대 너비 명시
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
    // 목데이터로 설문 데이터 생성
    fetchSurveyData() {
      // 하드코딩된 목데이터 예시
      const surveyData = [
        {
          id: 1,
          title: "설문 1",
          start_date: "2024-11-14",
          end_date: "2024-11-20",
        },
        {
          id: 2,
          title: "설문 2",
          start_date: "2024-11-16",
          end_date: "2024-11-22",
        },
        {
          id: 3,
          title: "설문 3",
          start_date: "2024-11-18",
          end_date: "2024-11-25",
        },
        {
          id: 4,
          title: "설문 4",
          start_date: "2024-11-13",
          end_date: "2024-11-25",
        },
        {
          id: 5,
          title: "설문 5",
          start_date: "2024-11-23",
          end_date: "2024-12-01",
        },
      ];

      // 캘린더 이벤트 형식으로 변환
      this.calendarOptions.events = surveyData.map((survey, index) => ({
        title: survey.title,
        start: survey.start_date,
        end: survey.end_date,
        color: this.getEventColor(index), // 색상 다르게 설정
        id: survey.id, // 아이템 ID를 설정하여 나중에 클릭 시 사용
      }));
    },

    // 이벤트 색상을 번갈아가며 다르게 설정
    getEventColor(index) {
      const colors = ["#FFFAC3", "#FEE4CB", "#E9D0E5", "#D1E2F4", "#D9C6BA", "F9C8CB", "#CCE6BF"];
      return colors[index % colors.length]; // 배열에서 순서대로 색상 사용
    },

    // 이벤트 클릭 시 SurveyEdit 페이지로 이동
    handleEventClick(info) {
      // 클릭된 이벤트의 ID를 통해 SurveyEdit 페이지로 이동
      const surveyId = info.event.id;
      this.$router.push({ name: "SurveyEdit", params: { id: surveyId } });
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
  max-width: 950px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* FullCalendar 기본 스타일 수정 */
.fc {
  width: 100%;
  max-width: 980px;
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
  margin-top: 16.6px;
  background: #DFE7EF;
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
  background-color: #F7F9FC;
}

.fc-direction-ltr .fc-button-group>.fc-button:not(:first-child),
.fc-direction-ltr .fc-button-group>.fc-button:not(:last-child) {
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
  background-color: #DFE7EF;
}

.fc-day-sun a {
  color: red;
}

/* 스크롤바 스타일링 */
.fc-daygrid-body::-webkit-scrollbar {
  display: none;
}
</style>
