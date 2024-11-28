<template>
    <div class="stats-section">
        <!-- 상단 통계 카드 -->
        <div class="info-cards-container">
            <div class="info-card respondent-card">
                <h3>응답자 수</h3>
                <p>{{ surveySummary.respondentCount }}명</p>
            </div>
            <div class="info-card remaining-time-card">
                <h3>설문 종료까지</h3>
                <p>{{ remainingTime }}</p>
            </div>
            <div class="info-card last-modified-card">
                <h3>최근 수정일</h3>
                <p>{{ surveySummary.lastModifiedDate }}</p>
            </div>
            <div class="share-buttons-container">
                <button class="share-button download-excel" @click="downloadExcel">
                    <img src="../assets/images/excel.svg" class="excel-icon">응답 데이터 엑셀로 다운로드
                </button>
                <button class="share-button send-email" @click="sendEmail">
                    <img src="../assets/images/gmail.svg" class="gmail-icon">응답 데이터 메일로 공유하기
                </button>
            </div>
        </div>

        <!-- 문항별 통계 -->
        <div class="questions-stats-container">
            <QuestionStats v-for="(question, id) in surveyResults" :key="id" :question="question.questionTitle"
                :response-type="question.responseType" :options="question.options || []"
                :responses="question.responses || []" />
        </div>
    </div>
</template>

<script>
import surveyData from "@/data/surveyResult";  // 임시 데이터
import QuestionStats from "../components/QuestionsStats.vue";  // 문항 통계 컴포넌트

export default {
    name: "StatsTab",
    components: {
        QuestionStats,
    },
    data() {
        return {
            surveySummary: surveyData.body.surveySummary,
            surveyResults: surveyData.body.surveyResults,
        };
    },
    computed: {
        remainingTime() {
            const now = new Date();
            const endDate = new Date(this.surveySummary.endDate);
            const diff = endDate - now;

            if (diff <= 0) return "종료됨";

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            return `${days}일 ${hours}시간`;
        },
    },
    methods: {
        downloadExcel() {
            console.log("엑셀 다운로드 클릭");
        },
        sendEmail() {
            console.log("이메일 공유 클릭");
        },
    },
};
</script>

<style scoped>
.stats-section {
    font-family: Pretendard;
    overflow-y: auto;
    overflow: hidden;
}

.stats-section::-webkit-scrollbar {
    display: none;
}

/* 상단 카드 스타일 */
.info-cards-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 20px;
}

.info-card {
    flex: 1;
    height: 115px;
    border-radius: 16px;
    padding: 5px;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 200px;
}

.info-card h3 {
    margin: 0 24px 8px;
    font-size: 16px;
}

.info-card p {
    margin: 0 24px;
    font-size: 24px;
    font-weight: bold;
}

.respondent-card {
    background-color: #E3F5FF;
}

.remaining-time-card {
    background-color: #E5ECF6;
}

.last-modified-card {
    background-color: #D3E2EC;
}

.share-buttons-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 28%;
}

.share-button {
    font-family: Pretendard;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    height: 55px;
    padding: 10px 20px;
    border: none;
    border-radius: 12.5px;
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;
    text-align: center;
}

.share-button img {
    width: 24px;
    height: 24px;
}

.download-excel {
    background: #C5ECD2;
}

.send-email {
    background: #FFDD80;
}

/* 문항별 통계 컨테이너 */
.questions-stats-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
</style>