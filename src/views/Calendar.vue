<template>
  <!-- <div id="calendar-wrapper"> -->
  <div>
    <FullCalendar :options="calendarOptions" />
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
        initialView: "dayGridMonth", // 기본 뷰 (달력)

        locale: "ko", // 한국어 로케일 사용
        headerToolbar: {
          left: "title",
          center: "",
          right: "today prev,next",
        },
        events: [], // 초기값은 빈 배열로 설정
        eventColor: "#4caf50", // 기본 이벤트 색상
        eventTextColor: "#ffffff", // 기본 텍스트 색상
        eventClick: this.handleEventClick, // 이벤트 클릭 시 호출할 메소드
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
      const colors = ["#4caf50", "#ff9800", "#2196f3", "#9c27b0", "#ff5722"];
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
#calendar-wrapper {
  max-width: 900px;
  margin: 20px auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

/* FullCalendar 기본 스타일 수정 */
.fc {
  font-family: "Arial", sans-serif;
  color: #333;
}

/* 캘린더 헤더 스타일 */
.fc-toolbar {
  margin-bottom: 10px;
}
.fc-toolbar-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4caf50;
}
.fc-button {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
}
.fc-button:hover {
  background-color: #388e3c;
}
.fc-button:disabled {
  background-color: #a5d6a7;
}

/* 날짜 셀 스타일 */
.fc-daygrid-day {
  border: 1px solid #e0e0e0;
}
.fc-daygrid-day-number {
  font-size: 0.9rem;
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
  border-radius: 4px;
  padding: 2px 4px;
}
</style>
