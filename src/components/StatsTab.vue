<template>
    <div class="stats-section">
        <div v-if="loading" class="loading-container">
            <p>데이터를 불러오는 중...</p>
        </div>
        <div v-else-if="error" class="error-container">
            <p>{{ error }}</p>
        </div>

        <!-- 상단 통계 카드 -->
        <div v-else class="info-cards-container">
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
                    <img src="../assets/images/excel.svg" class="excel-icon">응답 데이터 엑셀로 다운로드</button>
                <button class="share-button send-email" @click="sendEmail">
                    <img src="../assets/images/gmail.svg" class="gmail-icon">응답 데이터 메일로 공유하기</button>
            </div>
        </div>

        <!-- 문항별 통계 -->
        <div v-if="!loading && !error" class="questions-stats-container">
            <QuestionStats v-for="(question, id) in surveyResults" :key="id" :question="question" />
        </div>
    </div>
</template>

<script>
import QuestionStats from "../components/QuestionsStats.vue";
import { surveyAPI } from '@/service/surveyService';
import { useRoute } from 'vue-router';

export default {
    name: "StatsTab",
    components: {
        QuestionStats,
    },
    props: {
        surveyId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            surveySummary: {},
            surveyResults: {},
            loading: true,
            error: null,
        };
    },
    computed: {
        remainingTime() {
            if (!this.surveySummary.endDate) return "종료됨";
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
        async fetchSurveyResults() {
            const route = useRoute();

            try {
                this.loading = true;
                const response = await surveyAPI.getSurveyStats(route.params.id);

                if (response.data.resultCode === "200") {
                    this.surveySummary = response.data.body.surveySummary;
                    this.surveyResults = response.data.body.surveyResults || {};

                } else {
                    throw new Error('데이터를 불러오는 데 실패했습니다.');
                }
            } catch (error) {
                this.error = error.response?.data?.message || error.message || '데이터를 불러오는 중 오류가 발생했습니다.';
                console.error('API 호출 오류:', error);
            } finally {
                this.loading = false;
            }
        },
        downloadExcel() {
            console.log("엑셀 다운로드 클릭");
        },
        sendEmail() {
            console.log("이메일 공유 클릭");
        },
    },
    created() {
        this.fetchSurveyResults();
    }
};
</script>

<style scoped>
.stats-section {
    font-family: Pretendard;
    overflow-y: auto;
    height: 100%;
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